import { useEffect, useRef } from "react";

export default function Search({ query, search, setQuery }) {
  const inputEle = useRef(null);

  useEffect(() => {
    console.log(inputEle.current);
    inputEle.current.focus();

    if (document.activeElement === inputEle) return;
    const func = (e) => {
      if (e.code === "Enter") {
        inputEle.current.focus();
        setQuery("");
      }
    };
    document.addEventListener("keydown", func);

    return () => {
      document.removeEventListener("keydown", func);
    };
  }, [setQuery]);
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => search(e.target.value)}
      ref={inputEle}
    />
  );
}
