import { addToPersonalCollection } from "./moviestorage.js";
import { addComment } from './comments.js';

let selectedMovieTitle = '';

document.addEventListener('DOMContentLoaded', function () { //Barra de búsqueda
    const busqueda = document.querySelector("#busqueda");
    busqueda.addEventListener('input', debounce(searchMovies, 500));
});

document.addEventListener('DOMContentLoaded', function () { //Compartir link
    const shareButton = document.getElementById('share-button');
    shareButton.addEventListener('click', function () {
        const shareLink = getShareLink(); // Implement this function to get the share link
        updateShareModal(shareLink);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const moviesContainer = document.querySelector('.movies-container');
    moviesContainer.addEventListener('click', function (event) {
        const movieElement = event.target.closest('.movie');
        if (movieElement) {
            // Update the selectedMovieTitle when a movie is clicked
            selectedMovieTitle = movieElement.querySelector('.informacion p').textContent;
        }
    });
});

document.addEventListener('DOMContentLoaded', function () { //Añadir comentario

    // Handle form submission for adding comments
    const commentForm = document.getElementById('commentForm');
    commentForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Get values from the form
        const commentTitle = document.getElementById('commentTitle').value;
        const commentText = document.getElementById('commentText').value;
        const commentRating = document.getElementById('commentRating').value;

        // Add the comment using the imported function
        addComment(selectedMovieTitle, commentTitle, commentText, commentRating);

        // Clear the form
        commentForm.reset();
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Display comments in Bootstrap cards
    displayComments();
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
    const busqueda = document.querySelector("#busqueda");
    const query = busqueda.value.trim();

    const contenedor_de_peliculas = document.querySelector(".movies-container");

    if (query === '') {
        console.log("empty query!");
        // contenedor_de_peliculas.innerHTML = "";
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
        console.error('API Error:', error);
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
}

function loadDetailsModalMovie(movie) {
    loadDetailsModal(movie, true);
}

function loadDetailsModalTV(tv) {
    loadDetailsModal(tv, false);
}

// Function to get the share link (replace this with the actual link generation logic)
function getShareLink() {
    // Implement your logic to get the share link based on the selected movie
    // For example, you can use the movie ID or other unique identifier
    const selectedMovieId = getSelectedMovieId(); // Implement this function to get the selected movie ID
    return `https://movieadmin.com/movie/${selectedMovieId}`;
}

// Function to update the share modal content
function updateShareModal(shareLink) {
    const shareLinkParagraph = document.getElementById('shareModalLabel');
    shareLinkParagraph.textContent = `Compartir este enlace: ${shareLink}`;
}

// Function to get the selected movie ID (replace this with the actual logic)
function getSelectedMovieId() {
    // Implement your logic to get the selected movie ID
    // For example, you can use data attributes or other properties of the selected movie
    const selectedMovieElement = document.querySelector('.movie'); // Update this selector based on your structure
    return selectedMovieElement.dataset.id; // Adjust this property based on your movie ID property
}

function displayComments() {
    // Retrieve comments from local storage
    const comments = JSON.parse(localStorage.getItem('movieComments')) || [];

    // Get the container where you want to display the cards
    const commentsContainer = document.getElementById('commentsContainer');

    // Clear existing content
    commentsContainer.innerHTML = '';

    // Iterate over comments and create Bootstrap cards
    comments.forEach(comment => {
        const card = document.createElement('div');
        card.classList.add('card', 'mb-3');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        // Card title (movie)
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = comment.movieTitle;

        // Card subtitle (comment title)
        const cardSubtitle = document.createElement('h6');
        cardSubtitle.classList.add('card-subtitle', 'mb-2', 'text-muted');
        cardSubtitle.textContent = comment.commentTitle;

        // Card text (comment)
        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = comment.commentText;

        // Card rating
        const cardRating = document.createElement('p');
        cardRating.classList.add('card-text');
        cardRating.textContent = `Rating: ${comment.commentRating} ⭐`;

        // Append elements to card body
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardSubtitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(cardRating);

        // Append card body to card
        card.appendChild(cardBody);

        // Append card to container
        commentsContainer.appendChild(card);
    });
}

// module.exports = {
//     debounce,
//     searchMovies,
//     getMovies,
//     getTv,
//     clearScreen,
//     loadDetailsModal,
//     getShareLink,
//     updateShareModal,
//     getSelectedMovieId,
//     displayComments,
// };