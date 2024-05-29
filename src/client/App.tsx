import "./App.scss";
import React, { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import Movie from "./types/Movie";
import Header from "./Header";
import SearchBar from "./SearchBar";
import Notification from "./Notification";
import Results from "./Results";
import Pagination from "./Pagination";

/**
 * Fetch movies through our API
 *
 * @param term Search term
 * @param page Page number
 * @returns Promise with movie array and search result metadata
 */
async function fetchMovies(term: string, page: number) {
  const response = await fetch(`/api/movies?q=${term}&p=${page}`);
  return await response.json();
}

export default function App() {
  const [results, setResults] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [term, setTerm] = useState("");
  const [debouncedTerm] = useDebounce(term, 750);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isServedFromCache, setIsServedFromCache] = useState(false);

  const onTermChange = (term: string) => {
    setPage(1);
    setTerm(term);
  };

  const onSearch = () => {
    if (term.length < 3) {
      return;
    }

    setIsLoading(true);
    fetchMovies(debouncedTerm, page)
      .then((data) => {
        if (data.status === "error") {
          setError(data.message);
          setTotalResults(0);
        } else {
          setError("");
          setResults(data.movies || []);
          setPage(data.page || 1);
          setTotalPages(data.total_pages);
          setTotalResults(data.total_results);
          setIsServedFromCache(data.served_from_cache);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(onSearch, [debouncedTerm, page]);

  return (
    <>
      <Header />
      <SearchBar
        term={term}
        isLoading={isLoading}
        onTermChange={onTermChange}
        onSearch={onSearch}
      />
      <Notification
        isLoading={isLoading}
        error={error}
        totalResults={totalResults}
        isServedFromCache={isServedFromCache}
      />
      <Results results={results} />
      <Pagination page={page} total={totalPages} onChange={setPage} />
    </>
  );
}
