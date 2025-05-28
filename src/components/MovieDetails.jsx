import { useState, useEffect, useRef } from "react";
import StarRating from "./StarRating";
import Loader from "./Loader";
import { useKey } from "../customStates/useKey";

export default function MovieDetails({
    selectedId,
    onCloseMovie,
    onAddWatched,
    watched,
    API_KEY,
}) {
    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [userRating, setUserRating] = useState("");

    const countRef = useRef(0);

    useEffect(() => {
        if (userRating) countRef.current++;
    }, [userRating]);

    const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

    const {
        Title: title,
        Year: year,
        Poster: poster,
        Runtime: runtime,
        imdbRating,
        Plot: plot,
        Released: released,
        Actors: actors,
        Director: director,
        Genre: genre,
    } = movie;

    function handleAdd() {
        const newWatchedMovie = {
            imdbID: selectedId,
            title,
            year,
            poster,
            imdbRating: Number(imdbRating),
            runtime: Number(runtime.split(" ").at(0)),
            userRating,
            countRatingDicisions: countRef.current,
        };

        onAddWatched(newWatchedMovie);
        onCloseMovie();
    }

    useKey("Escape", onCloseMovie);

    const watchedUserRating = watched.find(
        (movie) => movie.imdbID === selectedId
    )?.userRating;

    useEffect(() => {
        if (title === undefined || title === null || title === "") {
            document.title = "Loading...";
        } else {
            document.title = `Movie | ${title}`;
        }

        return () => {
            document.title = "My Watchlist";
        };
    }, [title]);

    useEffect(() => {
        async function getMovieDetails() {
            setIsLoading(true);
            const res = await fetch(
                `https://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedId}`
            );

            const data = await res.json();
            setMovie(data);
            setIsLoading(false);
        }
        getMovieDetails();
    }, [selectedId, API_KEY]);

    return (
        <div className="details">
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <header>
                        <button className="btn-back" onClick={onCloseMovie}>
                            &larr;
                        </button>
                        <img src={poster} alt={`Poster of ${title}`} />{" "}
                        <div className="details-overview">
                            <h2>{title}</h2>
                            <p>
                                {released} &bull; {runtime}
                            </p>
                            <p>{genre}</p>
                            <p>
                                <span>⭐</span>
                                {imdbRating} IMDB Rating
                            </p>
                        </div>
                    </header>
                    <section>
                        <div className="rating">
                            {isWatched ? (
                                <h3 style={{ textAlign: "center" }}>
                                    You already rated this movie{" "}
                                    {watchedUserRating}
                                    <span>🌟</span>
                                </h3>
                            ) : (
                                <>
                                    <StarRating
                                        maxRating={10}
                                        size={25}
                                        onSetRating={setUserRating}
                                    />
                                    {userRating > 0 && (
                                        <button
                                            className="btn-add"
                                            onClick={handleAdd}
                                        >
                                            + Add to list
                                        </button>
                                    )}
                                </>
                            )}
                        </div>

                        <p>
                            <em>{plot}</em>
                        </p>
                        <p>Staring {actors}</p>
                        <p>Directed by {director}</p>
                    </section>
                </>
            )}
        </div>
    );
}
