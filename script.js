var myModal = new bootstrap.Modal(document.getElementById('movieModal'));

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

    if (query === '') { //Si la barra de búsqueda está vacía...
        console.log("empty query!");
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

        template.addEventListener('click', () => loadDetailsModalMovie(pelicula));

        fragmento.appendChild(template);
    });

    const contenedor_de_peliculas = document.querySelector(".movies-container");
    // contenedor_de_peliculas.innerHTML = "";
    contenedor_de_peliculas.appendChild(fragmento);
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

        template.addEventListener('click', () => loadDetailsModalTV(serie));

        fragmento.appendChild(template);
    });

    const contenedor_de_peliculas = document.querySelector(".movies-container");
    // contenedor_de_peliculas.innerHTML = "";
    contenedor_de_peliculas.appendChild(fragmento);
}

function clearScreen() { //Limpiar la pantalla cuando se presione el botón principal
    const contenedor_de_peliculas = document.querySelector(".movies-container");
    contenedor_de_peliculas.innerHTML = "";
}

function loadDetailsModalMovie(movie) {
    const modal = document.getElementById('movieModal');
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');

    // Set modal title
    modalTitle.textContent = movie.title;

    // Clear previous content
    modalBody.innerHTML = '';

    // Add other details as needed
    const overview = document.createElement('p');
    overview.textContent = movie.overview; // Adjust property based on your API response
    modalBody.appendChild(overview);

    // Show the modal
    myModal.show();
}

function loadDetailsModalTV(tv) {
    const modal = document.getElementById('movieModal');
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');

    // Set modal title
    modalTitle.textContent = tv.name;

    // Clear previous content
    modalBody.innerHTML = '';

    // Add other details as needed
    const overview = document.createElement('p');
    overview.textContent = tv.overview; // Adjust property based on your API response
    modalBody.appendChild(overview);

    // Show the modal
    myModal.show();
}
