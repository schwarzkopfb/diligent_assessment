import Koa from "koa";
import Route from "./Route";
import db from "./database";
import { fetchMovies, MovieQueryResponse } from "./tmdb";
import { MOVIE_CACHE_TTL_MS } from "./consts";

const { isArray } = Array;

type CachedMovieQueryResponse = MovieQueryResponse & { last_fetched_at: Date };

class MoviesRoute extends Route {
  name = "movies";

  /**
   * GET /movies?q=<search_term>&p=<page_number>
   *
   * Search for movies by a search term
   */
  async get(ctx: Koa.Context, next: Koa.Next) {
    const { q, p } = ctx.query;
    let page = 1;

    ctx.assert(q, 400, "Search term ('q') is required");
    ctx.assert(!isArray(q), 400, "Search term ('q') must be a single string");

    if (p) {
      ctx.assert(!isArray(p), 400, "Page number ('p') must be a single number");
      page = parseInt(p);
      ctx.assert(!isNaN(page), 400, "Page number ('p') must be a number");
      ctx.assert(page > 0, 400, "Page number ('p') must be greater than 0");
    }

    // check if the search is cached already
    const cachedSearch = (await db.movieSearch.findFirst({
      where: { term: q, page },
      include: {
        results: {
          include: { movie: true },
          take: 20,
        },
      },
    })) as CachedMovieQueryResponse | null;
    // if the search is cached, check if it's still fresh
    const serveFromCache = MoviesRoute.shouldServeFromCache(cachedSearch);
    // serve the cached search if it's fresh, otherwise fetch from TMDB
    const { results, total_pages, total_results } = serveFromCache
      ? cachedSearch!
      : await fetchMovies(q, page);
    // extract the movie entities from the results
    const movies = results.map(({ movie }) => movie);

    ctx.assert(page <= total_pages, 400, "Page number ('p') out of range");

    // first serve the search results without delaying the response
    // to the client for better performance / user experience
    ctx.body = {
      status: "success",
      page,
      total_pages,
      total_results,
      served_from_cache: serveFromCache,
      movies,
    };
    await next();

    // then create/update the cache-related records in the database sequentially
    // but without blocking the response to the client
    // → this anonymous async function is immediately invoked and not awaited in order to achieve this
    (async () => {
      if (serveFromCache) {
        // increment the cache hit count
        await db.movieSearch.update({
          where: { term_page: { term: q, page } },
          data: {
            cache_hit_count: {
              increment: 1,
            },
          },
        });
      } else {
        // upsert the movies
        await db.movie.createMany({
          data: movies,
          skipDuplicates: true,
        });

        // create the search cache entry or update the last fetch time if it already exists
        await db.movieSearch.upsert({
          where: {
            term_page: {
              term: q,
              page,
            },
          },
          update: {
            last_fetched_at: new Date(),
          },
          create: {
            term: q,
            page,
            total_pages,
            total_results,
          },
        });

        // upsert the m-to-n relationship between search and movies
        await db.movieSearchResult.createMany({
          data: movies.map(({ id }) => ({
            search_term: q,
            movie_id: id,
            page,
          })),
          skipDuplicates: true,
        });
      }
    })()
      // log any errors that occur during the cache update process
      .catch((err) => {
        console.error("Error updating cache records");
        console.error(err);
        // TODO: here we should log it to an error aggregation service like Sentry
      });
  }

  /**
   * Check if a cached search is still fresh
   *
   * @param cachedSearch A cached search response from the database or null
   * @returns Whether the cached search is still fresh
   */
  static shouldServeFromCache(
    cachedSearch: CachedMovieQueryResponse | null
  ): boolean {
    return Boolean(
      // is there a cached search?
      cachedSearch &&
        // and was it last fetched less than `MOVIE_CACHE_TTL_MS` ago?
        cachedSearch.last_fetched_at > new Date(Date.now() - MOVIE_CACHE_TTL_MS)
    );
  }
}

export default new MoviesRoute();
