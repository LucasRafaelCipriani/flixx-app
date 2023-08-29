const global = {
  currentPage: window.location.pathname,
};

async function displayPopularMovies() {
  const { results } = await fetchAPIData("movie/popular");

  results.forEach((movie) => {
    const releaseDate = new Date(movie.release_date);
    const movieImage = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "../images/no-image.jpg";
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
          <img
            src="${movieImage}"
            class="card-img-top"
            alt="${movie.title}"
          />
        </a>
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${releaseDate.toLocaleDateString(
              "en-US",
              { year: "numeric", month: "2-digit", day: "2-digit" }
            )}</small>
          </p>
        </div>
    `;

    document.getElementById("popular-movies").appendChild(div);
  });
}

async function displayPopularShows() {
  const { results } = await fetchAPIData("tv/popular");

  results.forEach((show) => {
    const firstAirDate = new Date(show.first_air_date);
    const showImage = show.poster_path
      ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
      : "../images/no-image.jpg";
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
          <a href="tv-details.html?id=${show.id}">
            <img
              src="${showImage}"
              class="card-img-top"
              alt="${show.name}"
            />
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${firstAirDate.toLocaleDateString(
                "en-US",
                { year: "numeric", month: "2-digit", day: "2-digit" }
              )}</small>
            </p>
          </div>
      `;

    document.getElementById("popular-shows").appendChild(div);
  });
}

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
  const API_KEY = "cdcf2eb8667da4906eecdcb1b34638ee";
  const API_URL = "https://api.themoviedb.org/3/";

  showSpinner();

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );
  const data = await response.json();

  hideSpinner();
  return data;
}

function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}

function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

// Highlight active link
function highlightActiveLink() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  });
}

// Init App
function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displayPopularMovies();
      break;
    case "/shows.html":
      displayPopularShows();
      break;
    case "/search.html":
      break;
    case "/tv-details.html":
      break;
    case "/movie-details.html":
      break;
    default:
      break;
  }

  highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
