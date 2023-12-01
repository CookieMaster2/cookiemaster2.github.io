fetch("https://imdb146.p.rapidapi.com/v1/find/?query=sexo", {
    method: 'GET',
    headers: {
    'X-RapidAPI-Key': 'b564a578c9msh60fbef2a59512e9p1b9cffjsn3e5dc1fac960',
    'X-RapidAPI-Host': 'imdb146.p.rapidapi.com'
    }
})
.then(response => response.json())
.then((data) => {
    console.log(data)
    getMovies(data)
})
.catch((err) => {
    console.log(err)
})

function getMovies(peliculas) {
    const template_peliculas = document.querySelector("#template-container")
    const fragmento = document.createDocumentFragment()

    peliculas.titleResults.results.forEach(pelicula => {
        const titulo = pelicula.titleNameText
        console.log(titulo)
        const imagen = pelicula.titlePosterImageModel ? pelicula.titlePosterImageModel.url : 'defaultImageUrl';
        console.log(imagen)

        const template = document.importNode(template_peliculas.content, true)

        const nombrePelicula = template.querySelector("p")
        nombrePelicula.textContent = titulo

        const posterPelicula = template.querySelector(".poster-pelicula img")
        posterPelicula.setAttribute("src", imagen)

        fragmento.appendChild(template)        
    });

    const contenedor_de_peliculas = document.querySelector(".movies-container")
    contenedor_de_peliculas.appendChild(fragmento)

}

