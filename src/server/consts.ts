import "dotenv/config";

export const PORT = process.env.PORT || 3000;
export const MOVIE_CACHE_TTL_MS = 1000 * 60 * 2; // 2 minutes
export const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_API_AUTH_HEADER =
  "Bearer " + process.env.TMDB_API_READ_ACCESS_TOKEN;
