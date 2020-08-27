// Selecting elements from the DOM
const inputElement = document.querySelector("#inputValue");
const buttonElement = document.querySelector("#search");
const divMoviesSearchable = document.querySelector("#movies-searchable");
const divMoviesContainer = document.querySelector("#movies-container");

// FUNCTION CREATED TO DISPLAY MOVIE POSTERS
function moviesSection(movies) {
    const loop = movies.map((movie) => {
        if (movie.poster_path) {
            return `<img 
                src=${IMAGE_URL + movie.poster_path} 
                data-movie-id=${movie.id}
            />`;
        }
    })
    return loop.join("");
}

// CREATE A MOVIE CONTAINER
function createMovieContainer(movies, title = "") {
    const movieElement = document.createElement("div");
    movieElement.setAttribute("class", "movie");

    const movieTemplate = `
        <h2 class="title">${title}</h2>
        <section class="section">
            ${moviesSection(movies)}
        </section>
        <div class="content">
            <i class="far fa-times-circle content-close"></i>
        </div>
    `;

    movieElement.innerHTML = movieTemplate;
    return movieElement;
}

// FUNCTION CREATED FOR THE SECOND .THEN() IN THE METHOD FETCH()
function renderSearchMovies(data) {
    divMoviesSearchable.innerHTML = "";
    const movies = data.results;
    const movieBlock = createMovieContainer(movies);
    divMoviesSearchable.appendChild(movieBlock);
}

function renderMovies(data) {
    const movies = data.results;
    const movieBlock = createMovieContainer(movies, this.title);
    movieBlock.setAttribute("class", "category-movie");
    divMoviesContainer.appendChild(movieBlock);
}

// GET A MOVIE POSTER (INPUT AND BUTTON)
buttonElement.onclick = function(e) {
    e.preventDefault();
    const value = inputElement.value;
    searchMovie(value);

    inputElement.value = "";
    console.log("value :", value);
}



// FUNCTION TO CREATE AN <IFRAME>
function createIframe(video) {
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${video.key}`;
    iframe.width = 700;
    iframe.height = 600;
    iframe.allowFullscreen = true;

    return iframe;
}


// FUNCTION CREATED TO GET VIDEO DATA AND DETAILS
function createVideoTemplate(video, detail, similar, content) {
    content.innerHTML = "<i class='far fa-times-circle content-close'></i>";
    const videos = video.results;
    const length = videos.length > 1 ? 1 : videos.length;
    const iframeContainer = document.createElement("div");
    iframeContainer.setAttribute("class", "iframeContainer");

    for (let i = 0; i < length; i++) {
        const video = videos[i]; // video
        const iframe = createIframe(video);
        iframeContainer.appendChild(iframe);
        content.appendChild(iframeContainer);
    }

    // DETAILS DATA
    const title = detail.title;
    const vote = detail.vote_average * 10;

    const date = detail.release_date;
    const dateYear = date.substr(0, 4);

    const runtime = detail.runtime;
    let minutes = runtime % 60;
    let hour = (runtime-minutes) / 60;
    const duration = (hour + " h " + minutes + " min");

    const genres = detail.genres.map((genre) => {
        return `<p class="genre">${genre.name}</p>`;
    })

    const overview = detail.overview;
    const overview2 = overview.substring(0, overview.indexOf('.')) + "."; // ALLOWS YOU TO STOP THE SENTENCE AT THE FIRST POINT

    const divDetails = document.createElement("div");
    divDetails.setAttribute("class", "divDetails");
    divDetails.innerHTML = `<h1>${title}</h1>
    <div class="boxDetails">
    <div class="boxRecommended">
        <p class="recommended">Recommended at ${vote} %</p>
    </div>
    <div class="underRecommended">
        <p class="dateYear">${dateYear}</p>
        <div class="genres">${genres}</div>
        <p class="duration">${duration}</p>
    </div>
    </div>
    <p class="overview">${overview2}</p>`;
    content.appendChild(divDetails);


    // SIMILAR MOVIES
    const divDetail = document.querySelector(".divDetails");
    const similarMovies = similar.results;
    const loop = similarMovies.map((movie) => {
        const realaseDate = movie.release_date;
        const year = realaseDate.substr(0, 4);
        if (movie.poster_path)
            return `<div class="containerSimilarMovie">
            <img 
                class="imgSimilar"
                src=${IMAGE_URL + movie.poster_path} 
                data-movie-id=${movie.id}
            />
            <div class="underboxSimilar">
                <p class="recommended2">${`Recommended at ${movie.vote_average * 10} %`}</p>
                <p class="year">${year}</p>
            </div>
            </div>`;
    });
    // const loop2 = loop.slice(0, 6);
    const loop3 = loop.join('');

    const divSimilar = document.createElement("div");
    divSimilar.setAttribute("class", "divSimilar");
    divSimilar.innerHTML = `<div class="similarMovie">
        <h2>Similar Movies</h2>
        <section class="boxSimilarMovies">${loop3}</section>
    </div>`;

    divDetail.appendChild(divSimilar);
}




// GET A MOVIE TRAILER
document.onclick = function(e) {

    const target = e.target;

    if(target.tagName.toLowerCase() === "img") {
        const movieId = target.dataset.movieId;
        console.log("movieID :", movieId);
        const section = target.parentElement;
        const content = section.nextElementSibling;
        content.classList.add("content-display");

        const path1 = `/movie/${movieId}/videos`;
        const urlVideo = generateUrl(path1);

        const path2 = `/movie/${movieId}`;
        const urlDetails = generateUrl(path2);

        const path3 = `/movie/${movieId}/similar`;
        const urlSimilar = generateUrl(path3);

        Promise.all([
            fetch(urlVideo),
            fetch(urlDetails),
            fetch(urlSimilar)
        ])
        .then(responses => {
            return Promise.all(responses.map(res => {
                return res.json();
            }));
        })
        .then(([ video, detail, similar]) => createVideoTemplate(video, detail, similar, content))
        .catch((err) => {
            console.log("Error", err);
        });
    }

    if(target.tagName.toLowerCase() === "i") {
        const content = target.parentElement;
        content.classList.remove("content-display");
    }
}

// FUNCTIONS TO GET OTHER MOVIE GATEGORIES
searchMovie("Spider");
getPopularMovie();
getUpComingMovie();
getTopRatedMovie();
