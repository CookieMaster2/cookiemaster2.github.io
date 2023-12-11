import { addToPersonalCollection } from "./moviestorage.js";

document.addEventListener('DOMContentLoaded', function () {
    const busqueda = document.querySelector("#busqueda");
    busqueda.addEventListener('input', debounce(searchMovies, 500)); // función 'Debounce' para mejor desempeño
});

function debounce(func, delay) { //Función para definir un intervalo de tiempo entre búsquedas
    let timeoutId;
    return function () {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, arguments);
        }, delay);
    };
}

async function searchMovies() { //Recibe datos de la API mediante la búsqueda; función asíncrona
    const query = busqueda.value.trim();

    const contenedor_de_peliculas = document.querySelector(".movies-container");

    if (query === '') { //Si la barra de búsqueda está vacía...
        console.log("empty query!");
        contenedor_de_peliculas.innerHTML = "";
        return;
    }

    const options = { //Método GET de la API para los datos
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NWYxNWI2NGUzNzkyYjA0ZGJiMDY4MjI2ZDk4MmY2ZCIsInN1YiI6IjY1NzE1NTBlODU4Njc4MDEyYzkyNzk3YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Gtk2cDjC-uqdbAVQgmu4tyLADgNVGTku4J-guKD0Seo'
        }
    };

    try { //Se reciben los datos de la API de forma paralela
        const [movies, tv] = await Promise.all([
            fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=true&language=es-MX&page=1`, options).then(response => response.json()),
            fetch(`https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=true&language=es-MX&page=1`, options).then(response => response.json())
        ]);

        getMovies(movies) //Agarra los datos de las películas, y los maqueta
        // console.log(movies)

        getTv(tv) //Agarra los datos de las series, y los maqueta
        // console.log(tv)

    } catch (error) { //Error
        console.log(error)
    }

}


function getMovies(peliculas) { //Función que recibe los datos de las películas y las maqueta con #template
    const template_peliculas = document.querySelector("#template-container")
    const fragmento = document.createDocumentFragment()

    peliculas.results.forEach(pelicula => {
        const titulo = pelicula.title;
        console.log(titulo);

        const imagen = pelicula.poster_path ?? "assets/not-found.jpg";
        console.log(imagen);

        const template = document.importNode(template_peliculas.content, true);

        const nombrePelicula = template.querySelector("p");
        nombrePelicula.textContent = titulo;

        const posterPelicula = template.querySelector(".poster-pelicula img");

        if (pelicula.poster_path == undefined) {
            posterPelicula.setAttribute("src", imagen)
        } else {
            posterPelicula.setAttribute("src", "https://image.tmdb.org/t/p/original" + imagen);
        }

        // template.addEventListener('click', () => loadDetailsModalMovie(pelicula));

        fragmento.appendChild(template);
    });

    const contenedor_de_peliculas = document.querySelector(".movies-container");
    // contenedor_de_peliculas.innerHTML = "";
    contenedor_de_peliculas.appendChild(fragmento);

    contenedor_de_peliculas.addEventListener('click', function (event) {
        const movieElement = event.target.closest('.movie');
        if (movieElement) {
            const movieData = peliculas.results.find(movie => movie.title === movieElement.querySelector("p").textContent);
            loadDetailsModalMovie(movieData);
        }
    });
}

function getTv(series) { //Función que recibe los datos de las series y los maqueta con #template
    const template_peliculas = document.querySelector("#template-container")
    const fragmento = document.createDocumentFragment()

    series.results.forEach(serie => {
        const titulo = serie.name;
        console.log(titulo);

        const imagen = serie.poster_path ?? "assets/not-found.jpg";
        console.log(imagen);

        const template = document.importNode(template_peliculas.content, true);

        const nombreSerie = template.querySelector("p");
        nombreSerie.textContent = titulo;

        const posterSerie = template.querySelector(".poster-pelicula img");

        if (serie.poster_path == undefined) {
            posterSerie.setAttribute("src", imagen)
        } else {
            posterSerie.setAttribute("src", "https://image.tmdb.org/t/p/original" + imagen);
        }

        // template.addEventListener('click', () => loadDetailsModalTV(serie));

        fragmento.appendChild(template);
    });

    const contenedor_de_peliculas = document.querySelector(".movies-container");
    // contenedor_de_peliculas.innerHTML = "";
    contenedor_de_peliculas.appendChild(fragmento);

    contenedor_de_peliculas.addEventListener('click', function (event) {
        const tvElement = event.target.closest('.movie');
        if (tvElement) {
            const tvData = series.results.find(tv => tv.name === tvElement.querySelector("p").textContent);
            loadDetailsModalTV(tvData);
        }
    });
}

function clearScreen() { //Limpiar la pantalla cuando se presione el botón principal
    const contenedor_de_peliculas = document.querySelector(".movies-container");
    contenedor_de_peliculas.innerHTML = "";
}

function loadDetailsModal(data, isMovie) {
    const modalTitle = document.getElementById('movieModalLabel');
    const modalBody = document.querySelector('.modal-body');

    modalTitle.textContent = isMovie ? data.title : data.name;
    modalBody.innerHTML = ''; // Clear previous modal content

    const modalContent = document.createElement('div');

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

    addToCollectionButton.addEventListener('click', function () {
        addToPersonalCollection(data); // Use 'data' instead of 'movie'
        alert('Movie added to your collection!');
    });

    modalBody.appendChild(modalContent);

    // Show the modal
    // const modal = new bootstrap.Modal(document.getElementById('movieModal'));
    // modal.show();
}

// Usage example
function loadDetailsModalMovie(movie) {
    loadDetailsModal(movie, true);
}

function loadDetailsModalTV(tv) {
    loadDetailsModal(tv, false);
}

