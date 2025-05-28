const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function WatchedSummary({ watched }) {
    const validWatched = watched || [];

    const avgImdbRating = parseFloat(
        average(validWatched.map((movie) => movie.imdbRating || 0)).toFixed(2)
    );
    const avgUserRating = parseFloat(
        average(validWatched.map((movie) => movie.userRating || 0)).toFixed(2)
    );
    const avgRuntime = parseFloat(
        average(validWatched.map((movie) => movie.runtime || 0)).toFixed(2)
    );

    return (
        <div className="summary">
            <h2>Movies you watched</h2>
            <div>
                <p>
                    <span>#️⃣</span>
                    <span>{validWatched.length} movies</span>
                </p>
                <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{avgUserRating}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                </p>
            </div>
        </div>
    );
}
