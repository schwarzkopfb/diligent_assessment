import { Movie } from "@prisma/client";
import { TMDB_API_BASE_URL, TMDB_API_AUTH_HEADER } from "./consts";

const GET_MOVIES_OPTS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: TMDB_API_AUTH_HEADER,
  },
};

export interface MovieWithSearchMetadata {
  movie: Movie;
  movie_id: number;
  search_term?: string;
  page?: number;
  created_at?: Date;
}

export interface MovieQueryResponse {
  results: MovieWithSearchMetadata[];
  total_pages: number;
  total_results: number;
}

/**
 * Select the fields we need from the TMDB API response and wrap them in a MovieWithSearchMetadata object
 *
 * @param result The result entity returned from the TMDB API
 * @returns An object suitable for storing in the database and sending to our API consumers
 */
function projectResultFields(
  result: Record<string, string | number>
): MovieWithSearchMetadata {
  // TODO: this would be a good place to add some validation to ensure the result object

  return {
    movie_id: result.id as number,
    movie: {
      id: result.id,
      original_language: result.original_language,
      original_title: result.original_title,
      overview: result.overview,
      popularity: result.popularity,
      poster_path: result.poster_path,
      release_date: result.release_date,
      title: result.title,
      vote_average: result.vote_average,
      vote_count: result.vote_count,
    } as Movie,
  };
}

/**
 * Fetch movies from the TMDB API
 *
 * @param query Search term for querying movies
 * @param page Result page number
 * @returns A promise that resolves to an object containing the search results and metadata
 */
export async function fetchMovies(
  query: string,
  page: number
): Promise<MovieQueryResponse> {
  const url = `${TMDB_API_BASE_URL}/search/movie?query=${query}&page=${page}`;
  const response = await fetch(url, GET_MOVIES_OPTS);
  const data = await response.json();

  return {
    results: data.results.map(projectResultFields),
    total_pages: data.total_pages,
    total_results: data.total_results,
  } as MovieQueryResponse;
}
