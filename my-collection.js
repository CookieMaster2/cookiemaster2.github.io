import { getPersonalCollection } from "./moviestorage.js";

const movieTemplate = document.getElementById('template-container');
const modalTemplate = document.getElementById('modal-template');

document.addEventListener('DOMContentLoaded', function () {
    const personalCollection = getPersonalCollection();
    displayCollection(personalCollection);
});

function displayCollection(personalCollection) {
    const collectionContainer = document.querySelector('.collection-container');

    personalCollection.forEach((movie, index) => {
        const movieDiv = document.importNode(movieTemplate.content, true);

        const posterImage = movieDiv.querySelector('.poster-pelicula img');
        posterImage.src = "https://image.tmdb.org/t/p/original" + movie.poster_path;
        posterImage.alt = movie.title;

        const titleParagraph = movieDiv.querySelector('.informacion p');
        titleParagraph.textContent = movie.title ?? movie.name;

        movieDiv.querySelector('.movie').dataset.index = index;

        collectionContainer.appendChild(movieDiv);
    });

    // Add the event listener to the collection container
    collectionContainer.addEventListener('click', function (event) {
        const movieElement = event.target.closest('.movie');
        if (movieElement) {
            const movieIndex = movieElement.dataset.index;
            const movieDetails = personalCollection[movieIndex];
            loadDetailsModal(movieDetails);
        }
    });
}

function loadDetailsModal(data) {
    const modalTitle = document.getElementById('collectionModalLabel');
    const modalBody = document.querySelector('.modal-body');

    modalTitle.textContent = data.title ?? data.name;
    modalBody.innerHTML = ''; // Clear previous modal content

    const modalContent = document.createElement('div');

    // Check if the necessary properties exist in the data object
    if (data.poster_path && data.overview && (data.release_date ?? data.first_air_date)) {
        modalContent.innerHTML = `
            <img src="https://image.tmdb.org/t/p/original${data.poster_path}" alt="${data.title ?? data.name}" class="modal-poster">
            <p>${data.overview}</p>
            <p>${'First Air Date'}: ${data.release_date ?? data.first_air_date}</p>
            <!-- Add more details as needed -->
        `;
    } else {
        modalContent.textContent = 'Details not available.';
    }

    modalBody.appendChild(modalContent);

    const modal = new bootstrap.Modal(document.getElementById('movieModal'));
    modal.show();
}