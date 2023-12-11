import { addToPersonalCollection } from "./moviestorage.js";

document.addEventListener('DOMContentLoaded', function () {
    const busqueda = document.querySelector("#busqueda");
    busqueda.addEventListener('input', debounce(searchMovies, 500));
});

function debounce(func, delay) {
    let timeoutId;
    return function () {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, arguments);
        }, delay);
    };
}

async function searchMovies() {
    const query = busqueda.value.trim();

    const contenedor_de_peliculas = document.querySelector(".movies-container");

    if (query === '') {
        console.log("empty query!");
        contenedor_de_peliculas.innerHTML = "";
        return;
    }

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NWYxNWI2NGUzNzkyYjA0ZGJiMDY4MjI2ZDk4MmY2ZCIsInN1YiI6IjY1NzE1NTBlODU4Njc4MDEyYzkyNzk3YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Gtk2cDjC-uqdbAVQgmu4tyLADgNVGTku4J-guKD0Seo'
        }
    };

    try {
        const [movies, tv] = await Promise.all([
            fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=true&language=es-MX&page=1`, options).then(response => response.json()),
            fetch(`https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=true&language=es-MX&page=1`, options).then(response => response.json())
        ]);

        getMovies(movies);
        getTv(tv);

    } catch (error) {
        console.log(error);
    }
}

function getMovies(peliculas) {
    const template_peliculas = document.querySelector("#template-container");
    const fragmento = document.createDocumentFragment();

    peliculas.results.forEach(pelicula => {
        const template = document.importNode(template_peliculas.content, true);
        template.querySelector('.movie').setAttribute('data-id', `movie-${pelicula.id}`);
        template.querySelector('.movie').setAttribute('data-type', 'movie');

        const nombrePelicula = template.querySelector("p");
        nombrePelicula.textContent = pelicula.title;

        const posterPelicula = template.querySelector(".poster-pelicula img");
        const imagen = pelicula.poster_path ?? "assets/not-found.jpg";

        if (pelicula.poster_path == undefined) {
            posterPelicula.setAttribute("src", imagen);
        } else {
            posterPelicula.setAttribute("src", "https://image.tmdb.org/t/p/original" + imagen);
        }

        fragmento.appendChild(template);
    });

    const contenedor_de_peliculas = document.querySelector(".movies-container");

    contenedor_de_peliculas.addEventListener('click', function (event) {
        const movieElement = event.target.closest('.movie[data-type="movie"]');
        if (movieElement) {
            const movieId = movieElement.getAttribute('data-id');
            const isMovie = movieElement.getAttribute('data-type') === 'movie';
            const movieData = isMovie ? peliculas.results.find(movie => `movie-${movie.id}` === movieId) : series.results.find(tv => `tv-${tv.id}` === movieId);
            loadDetailsModal(movieData, isMovie);
        }
    });

    // Append the new content instead of replacing it
    contenedor_de_peliculas.appendChild(fragmento);
}

function getTv(series) {
    const template_peliculas = document.querySelector("#template-container");
    const fragmento = document.createDocumentFragment();

    series.results.forEach(serie => {
        const template = document.importNode(template_peliculas.content, true);
        template.querySelector('.movie').setAttribute('data-id', `tv-${serie.id}`);
        template.querySelector('.movie').setAttribute('data-type', 'tv');

        const nombreSerie = template.querySelector("p");
        nombreSerie.textContent = serie.name;

        const posterSerie = template.querySelector(".poster-pelicula img");
        const imagen = serie.poster_path ?? "assets/not-found.jpg";

        if (serie.poster_path == undefined) {
            posterSerie.setAttribute("src", imagen);
        } else {
            posterSerie.setAttribute("src", "https://image.tmdb.org/t/p/original" + imagen);
        }

        fragmento.appendChild(template);
    });

    const contenedor_de_peliculas = document.querySelector(".movies-container");

    contenedor_de_peliculas.addEventListener('click', function (event) {
        const tvElement = event.target.closest('.movie[data-type="tv"]');
        if (tvElement) {
            const tvId = tvElement.getAttribute('data-id');
            const tvData = series.results.find(tv => `tv-${tv.id}` === tvId);
            loadDetailsModal(tvData, false);
        }
    });

    // Append the new content instead of replacing it
    contenedor_de_peliculas.appendChild(fragmento);
}

function clearScreen() {
    const contenedor_de_peliculas = document.querySelector(".movies-container");
    contenedor_de_peliculas.innerHTML = "";
}

function loadDetailsModal(data, isMovie) {
    const modalTitle = document.getElementById('movieModalLabel');
    const modalBody = document.querySelector('.modal-body');

    modalTitle.textContent = isMovie ? data.title : data.name;
    modalBody.innerHTML = ''; // Clear previous modal content

    const modalContent = document.createElement('div');

    // Extract the correct data ID based on the type (movie or TV)
    const dataId = `#${isMovie ? 'movie' : 'tv'}-${data.id}`;

    // Check if the necessary properties exist in the data object
    if (data.poster_path && data.overview && (isMovie ? data.release_date : data.first_air_date)) {
        modalContent.innerHTML = `
            <img src="https://image.tmdb.org/t/p/original${data.poster_path}" alt="${isMovie ? data.title : data.name}" class="modal-poster">
            <p>${data.overview}</p>
            <p>${isMovie ? 'Release Date' : 'First Air Date'}: ${isMovie ? data.release_date : data.first_air_date}</p>
            <!-- Add more details as needed -->
        `;
    } else {
        modalContent.textContent = 'Details not available.';
    }

    const addToCollectionButton = document.getElementById('collection-button');

    // Remove previous click event listener to avoid multiple executions
    addToCollectionButton.onclick = null;

    // Add a new click event listener
    addToCollectionButton.onclick = function () {
        addToPersonalCollection(data); // Use 'data' instead of 'movie'
        alert('Movie/TV series added to your collection!');
    };

    modalBody.appendChild(modalContent);

    // Show the modal
    // const modal = new bootstrap.Modal(document.getElementById('movieModal'));
    // modal.show();
}

function loadDetailsModalMovie(movie) {
    loadDetailsModal(movie, true);
}

function loadDetailsModalTV(tv) {
    loadDetailsModal(tv, false);
}
