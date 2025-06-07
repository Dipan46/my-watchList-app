import "./App.css";
import { useState } from "react";

// Import your custom hooks
import { useMovies } from "./customStates/useMovies";
import { useLocalStorageState } from "./customStates/useLocalStorageState";

// Import your components
import NumResults from "./components/Navbar/NumResults";
import ErrorMessage from "./components/ErrorMessage";
import Navbar from "./components/Navbar/Navbar";
import MovieList from "./components/MovieList";
import Main from "./components/Main";
import Box from "./components/Box";
import Loader from "./components/Loader";
import Search from "./components/Navbar/Search";
import MovieDetails from "./components/MovieDetails";
import WatchedSummary from "./components/WatchedSummary";
import WatchedMovieList from "./components/WatchedMovieList";

const KEY = "cdcdc0c2";

export default function App() {
    const [query, setQuery] = useState("");
    const [selectedId, setSelectesId] = useState(null);

    // Custom hooks for logic separation
    const { movies, isLoading, error } = useMovies(query, KEY);
    const [watched, setWatched] = useLocalStorageState([], "watched");

    // Event-Handler Functions
    function handleSelectedMovie(id) {
        setSelectesId((curId) => (id === curId ? null : id));
    }

    function handleCloseMovie() {
        setSelectesId(null);
    }

    function handleAddWatchd(movie) {
        setWatched((prevWatched) => [...prevWatched, movie]);
    }

    function handleDeleteWatched(id) {
        setWatched((prevWatched) =>
            prevWatched.filter((movie) => movie.imdbID !== id)
        );
    }

    return (
        <>
            <Navbar>
                <Search query={query} setQuery={setQuery} />
                <NumResults movies={movies} />
            </Navbar>

            <Main>
                <Box>
                    {isLoading && <Loader />}
                    {!isLoading && !error && (
                        <MovieList
                            movies={movies}
                            onSelectMovie={handleSelectedMovie}
                        />
                    )}
                    {error && <ErrorMessage message={error} />}
                </Box>
                <Box>
                    {selectedId ? (
                        <MovieDetails
                            selectedId={selectedId}
                            onCloseMovie={handleCloseMovie}
                            onAddWatched={handleAddWatchd}
                            watched={watched}
                            API_KEY={KEY}
                        />
                    ) : (
                        <>
                            <WatchedSummary watched={watched} />
                            <WatchedMovieList
                                watched={watched}
                                onDeleteWatched={handleDeleteWatched}
                            />
                        </>
                    )}
                </Box>
            </Main>
        </>
    );
}
