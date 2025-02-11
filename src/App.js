import { useMovies } from "./useMovies";
import NavBar from "./NavBar";
import Search from "./Search";
import NumResults from "./NumResults";
import Main from "./Main";
import Box from "./Box";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import MovieList from "./Movie List";
import WatchedSummary from "./Watched Summary";
import MovieDetails from "./MovieDetails";
import WatchedMoviesList from "./WatchedMoviesList";

import { useState, useEffect } from "react";

export default function App() {
  const [watched, setWatched] = useState(() => {
    const storedValue = JSON.parse(localStorage.getItem("watched"));
    return storedValue;
  });

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [query, setQuery] = useState("");

  const { isLoad, movies, error } = useMovies(query);

  function handleAddWatched(movie) {
    setWatched((prev) => {
      if (prev.some((item) => item.imdbID === movie.imdbID)) {
        return prev; // Return the same state to prevent updates
      }
      return [...prev, movie]; // Add the movie if it's not in the list
    });
  }

  function handleDeleteWatched(id) {
    setWatched((prev) => prev.filter((item) => item.imdbID !== id));
  }
  function searchQuery(q) {
    setQuery(() => q);
  }

  function onSelectedMovie(movie) {
    setSelectedMovie(movie);
  }

  function onCloseMovie() {
    setSelectedMovie(null);
  }

  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);

  return (
    <>
      <NavBar>
        <Search query={query} search={searchQuery} setQuery={setQuery} />

        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoad && <Loader />}
          {error && <ErrorMessage err={error} />}
          {!isLoad && !error && movies.length > 0 && (
            <MovieList movies={movies} onSelect={onSelectedMovie} />
          )}
        </Box>

        <Box>
          {selectedMovie ? (
            <MovieDetails
              selectedID={selectedMovie}
              onClose={onCloseMovie}
              onWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDelete={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
