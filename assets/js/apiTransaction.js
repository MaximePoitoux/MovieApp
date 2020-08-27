// API - URL
const API_KEY = "4ec645879aa99a871f6ba0cfa5299287";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500"
const url = "https://api.themoviedb.org/3/search/movie?api_key=4ec645879aa99a871f6ba0cfa5299287";

// function API
function generateUrl(path) {
    const url = `https://api.themoviedb.org/3${path}?api_key=${API_KEY}`;
    return url;
}

function requestMovies(url, onComplete, onError) {
    fetch(url)
        .then((res) => res.json())
        .then(onComplete)
        .catch(onError)
}

function handleError(error) {
    console.log('Error', error);
}

function searchMovie(value) {
    const path = "/search/movie";
    const url = generateUrl(path) + "&query=" + value;
    requestMovies(url, renderSearchMovies, handleError)
}

function getPopularMovie() {
    const path = "/movie/popular";
    const url = generateUrl(path);

    const render = renderMovies.bind({ title: "Popular Movies" })
    requestMovies(url, render, handleError)
}

function getUpComingMovie() {
    const path = "/movie/upcoming";
    const url = generateUrl(path);

    const render = renderMovies.bind({ title: "Upcoming Movies" })
    requestMovies(url, render, handleError)
}

function getTopRatedMovie() {
    const path = "/movie/top_rated";
    const url = generateUrl(path);

    const render = renderMovies.bind({ title: "Top Rated Movies" })
    requestMovies(url, render, handleError)
}

