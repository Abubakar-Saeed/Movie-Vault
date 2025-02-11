import { useEffect, useState } from "react";
const APIKey = "6b56ea42";

export function useMovies(query) {
  const [error, setError] = useState("");
  const [isLoad, setIsLoad] = useState(false);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoad(true);
        setError(""); // Reset error state before fetching

        const result = await fetch(
          `https://www.omdbapi.com/?apikey=${APIKey}&s=${query}`,
          { signal: controller.signal }
        );
        if (!result.ok) {
          throw new Error("Something went wrong in fetching movies");
        }
        const data = await result.json();
        if (data.Response === "False") throw new Error("Movie Not Found ❌");
        console.log(data);
        if (data.Search) {
          setMovies(data.Search);
        }
        setIsLoad(() => false);
      } catch (e) {
        if (e.name !== "AbortError") {
          setError(e.message);
        }

        setIsLoad(false);
        console.log("Error is ", e);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    fetchMovies();

    return function () {
      controller.abort();
    };
  }, [query]);

  return { movies, isLoad, error };
}
