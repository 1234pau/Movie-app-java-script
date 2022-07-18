const BASEURL = 'https://api.themoviedb.org/3'
const APIURL = BASEURL + '/discover/movie?sort_by=popularity.desc&api_key=468ec4949683b073a5d620a9deed5da0&append_to_response=videos,images'
const IMGPATH = 'https://image.tmdb.org/t/p/w500'
const SEARCH = 'https://api.themoviedb.org/3/search/movie?api_key=468ec4949683b073a5d620a9deed5da0&query='
const videos = 'https://api.themoviedb.org/3/movie?api_key=468ec4949683b073a5d620a9deed5da0&query='

const container = document.querySelector('.container')
const inputElement = document.querySelector('.inputElement')
const form = document.querySelector('.form')
const date = document.querySelector('.date')
const description = document.querySelector('.description')
const buttonTrailer = document.querySelector('.trailer')
const videoContainer = document.querySelector('.videoContainer')
const mesage = document.querySelector('.mesage')

getMovies(APIURL);

async function getMovies(url) {
    const resp = await fetch(url);
    const respData = await resp.json();
    console.log(respData)
    showMovie(respData.results)
}
//create poster and the other things:)
function showMovie(movies) {
    container.innerHTML = ''

    movies.forEach((movie) => {
        const { id, poster_path, title, vote_average, overview, release_date } = movie;

        if (poster_path) {
            const movieEl = document.createElement('div')
            movieEl.classList.add('movie')
            movieEl.innerHTML = `
            <a href="#presentation">
            <img
                src="${IMGPATH + poster_path}"
                alt="${title}"
                class="poster"
            />
            </a>
        `;
            container.appendChild(movieEl)

            const titleH2 = document.querySelector('.title')
            const voteAverage = document.querySelector('.voteAverage')
            const presentation = document.querySelector('.presentation')
            const image = document.querySelector('.image')
            movieEl.querySelector('img').addEventListener('click', () => {
                videoContainer.style.display = 'none'
                mesage.style.display = 'none'
                buttonTrailer.addEventListener('click', async function() {
                    //fetch the video content
                    const resp = await fetch(BASEURL + `/movie/${id}/videos?&api_key=468ec4949683b073a5d620a9deed5da0`)
                    const respData = await resp.json();

                    console.log(respData.results)
                    console.log('Butonul pentru trailer s-a apasat')

                    //remove the child of the videoContainer element before you press the trailer button
                    while (videoContainer.firstChild) {
                        videoContainer.removeChild(videoContainer.firstChild);
                    }
                    //send a server problem message if the trailer is not found
                    if (respData.results.length == 0) {
                        mesage.style.display = 'block'
                        videoContainer.style.display = 'none'
                        console.log('Uups, se pare ca avem o problema cu serverul!')
                    } else {
                        mesage.style.display = 'none'
                    }
                    showVideos(respData.results)

                })

                presentation.style.display = 'block';
                titleH2.textContent = title;
                voteAverage.innerHTML = vote_average;
                date.textContent = `Release date: ${release_date}`
                image.setAttribute('src', IMGPATH + poster_path);
                description.textContent = overview;
                console.log('a fost apasat un poster');
                // manipulate stars-----------------------------
                const starIcons = Array.from(document.querySelectorAll('.fa-star'))
                const firstStar = starIcons[0]
                const secondStar = starIcons[1]
                const theardStar = starIcons[2]
                const forthStar = starIcons[3]
                const fifthStar = starIcons[4]

                if (vote_average == 0) {
                    voteAverage.style.color = 'red'
                    firstStar.classList.remove('colored')
                    secondStar.classList.remove('colored')
                    theardStar.classList.remove('colored')
                    forthStar.classList.remove('colored')
                } else if (vote_average <= 1) {
                    voteAverage.style.color = 'red'
                    firstStar.classList.add('colored')
                    secondStar.classList.remove('colored')
                    theardStar.classList.remove('colored')
                    forthStar.classList.remove('colored')
                    fifthStar.classList.remove('colored')
                } else if (vote_average <= 3) {
                    voteAverage.style.color = 'orange'
                    firstStar.classList.add('colored')
                    secondStar.classList.add('colored')
                    theardStar.classList.remove('colored')
                    forthStar.classList.remove('colored')
                    fifthStar.classList.remove('colored')


                } else if (vote_average <= 5) {
                    voteAverage.style.color = 'orange'
                    firstStar.classList.add('colored')
                    secondStar.classList.add('colored')
                    theardStar.classList.remove('colored')
                    forthStar.classList.remove('colored')

                } else if (vote_average <= 7) {
                    voteAverage.style.color = 'yellow'
                    firstStar.classList.add('colored')
                    secondStar.classList.add('colored')
                    theardStar.classList.add('colored')
                    forthStar.classList.remove('colored')
                    fifthStar.classList.remove('colored')

                } else if (vote_average <= 9) {
                    voteAverage.style.color = 'yellow'
                    firstStar.classList.add('colored')
                    secondStar.classList.add('colored')
                    theardStar.classList.add('colored')
                    forthStar.classList.add('colored')
                    fifthStar.classList.remove('colored')

                } else {
                    voteAverage.style.color = 'green'
                    forthStar.classList.add('colored')
                    fifthStar.classList.add('colored')
                }
                // -------------------------------------------------

            })
        }
    })
}
// add a submit event for form element in order to show the mouvies you want
form.addEventListener('submit', function(e) {

    e.preventDefault()
    const value = inputElement.value
    if (value) {
        getMovies(SEARCH + value)
        inputElement.value = ''
    }
    inputElement.focus()
})

// create video iframe
function showVideos(videos) {
    videos.forEach((video) => {

        const { type, key, } = video
        if (type == 'Trailer' || type == 'Teaser' <= 4) {

            const iframe = document.createElement('iframe')
            iframe.classList.add('video')
            iframe.src = `http://www.youtube.com/embed/${key}`;
            iframe.width = 280;
            iframe.height = 225;
            iframe.allowFullscreen = true;
            videoContainer.appendChild(iframe)
            videoContainer.style.display = 'flex'

            if (videos.length >= 5) {
                iframe.width = 200;
                iframe.height = 145;
            }
        }
    })

}