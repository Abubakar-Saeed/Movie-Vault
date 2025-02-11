import WatchedMovie from "./WatchedMovie";

export default function WatchedMoviesList({ watched, onDelete }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} onDelete={onDelete} key={movie.imdbID} />
      ))}
    </ul>
  );
}
