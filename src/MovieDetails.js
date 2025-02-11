import { useEffect, useState } from "react";
import StarRating from "./StarRating";
const APIKey = "6b56ea42";

export default function MovieDetails({
  selectedID,
  onClose,
  onWatched,
  watched,
}) {
  const [movie, setMovie] = useState(null);
  const [userRating, setUserRating] = useState(0);

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedID);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedID
  )?.userRating;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return function () {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    async function getMovieDetail() {
      try {
        const result = await fetch(
          `https://www.omdbapi.com/?apikey=${APIKey}&i=${selectedID}`
        );
        const data = await result.json();

        if (data.Response === "True") {
          setMovie(data);
          console.log(data);
        } else {
          console.error("Error fetching movie:", data.Error);
        }
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      }
    }

    if (selectedID) getMovieDetail();
  }, [selectedID]); // Added selectedID as a dependency

  useEffect(() => {
    if (!movie?.Title) return;
    document.title = `Movie | ${movie?.Title}`;

    return function () {
      document.title = "MovieVault";
    };
  }, [movie?.Title]);

  if (!movie) return <p>Loading detail</p>;
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleWatched() {
    const newWatchedMovie = {
      imdbID: selectedID,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating: userRating,
    };

    onWatched(newWatchedMovie);
    onClose();
  }

  return (
    <div className="details">
      <header>
        <button className="btn-back" onClick={onClose}>
          &larr;
        </button>

        <img src={poster} alt={title} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {year} &bull; {runtime}
          </p>

          <p>{genre}</p>
          <p>
            <span>⭐</span>
            {imdbRating} IMDb Rating
          </p>
        </div>
      </header>
      <section>
        <>
          <div className="rating">
            {!isWatched && (
              <StarRating
                maxRating={10}
                color="yellow"
                size={26}
                onSetRating={setUserRating}
              />
            )}
            {userRating > 0 && (
              <button className="btn-add" onClick={() => handleWatched()}>
                + Add To List
              </button>
            )}

            {isWatched && (
              <p>
                You already rated this movie with {watchedUserRating} rating
              </p>
            )}
          </div>
        </>

        <p>
          <em>{plot}</em>
        </p>
        <p>Starring {actors}</p>
        <p>Directed By {director}</p>
      </section>
    </div>
  );
}
