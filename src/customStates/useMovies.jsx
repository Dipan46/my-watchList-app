import { useState, useEffect } from "react";

export function useMovies(query, KEY) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function fetchMovies() {
            try {
                setIsLoading(true);
                setError("");

                // Prevent fetching if the query is empty
                if (!query) {
                    setMovies([]);
                    setError("");
                    return;
                }

                const res = await fetch(
                    `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
                    { signal: controller.signal }
                );

                if (!res.ok) {
                    throw new Error(
                        "Something went wrong with fetching movies"
                    );
                }

                const data = await res.json();

                if (data.Response === "False") {
                    throw new Error(data.Error);
                }

                setMovies(data.Search);
                setError("");
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error(err.message);
                    setError(err.message);
                }
            } finally {
                setIsLoading(false);
            }
        }

        const id = setTimeout(() => {
            fetchMovies();
        }, 500);

        return () => {
            controller.abort();
            clearTimeout(id);
        };
    }, [query, KEY]);

    return { movies, isLoading, error };
}
