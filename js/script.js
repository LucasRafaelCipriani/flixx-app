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
              {
                timeZone: "UTC",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }
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
                {
                  timeZone: "UTC",
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                }
              )}</small>
            </p>
          </div>
      `;

    document.getElementById("popular-shows").appendChild(div);
  });
}

async function displayMovieDetails() {
  const movieId = window.location.search.split("=")[1];

  const movie = await fetchAPIData(`movie/${movieId}`);
  const releaseDate = new Date(movie.release_date);
  const movieImage = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "../images/no-image.jpg";

  const movieDetailsEl = document.getElementById("movie-details");
  movieDetailsEl.innerHTML = `
    <div class="details-top">
      <div>
        <img
          src="${movieImage}"
          class="card-img-top"
          alt="${movie.title}"
        />
      </div>
      <div>
        <h2>${movie.title}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${movie.vote_average.toFixed(1)} / 10
        </p>
        <p class="text-muted">Release Date: ${releaseDate.toLocaleDateString(
          "en-US",
          { timeZone: "UTC", year: "numeric", month: "2-digit", day: "2-digit" }
        )}</p>
        <p>
          ${movie.overview}
        </p>
        <h5>Genres</h5>
        <ul class="list-group">
          ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
        </ul>
        <a href="${
          movie.homepage
        }" target="_blank" class="btn">Visit Movie Homepage</a>
      </div>
    </div>
    <div class="details-bottom">
      <h2>Movie Info</h2>
      <ul>
        <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(
          movie.budget
        )}</li>
        <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
          movie.revenue
        )}</li>
        <li><span class="text-secondary">Runtime:</span> ${
          movie.runtime
        } minutes</li>
        <li><span class="text-secondary">Status:</span> ${movie.status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">
        ${movie.production_companies
          .map((company) => `<span>${company.name}</span>`)
          .join(", ")}
      </div>
    </div>
  `;

  displayBackgroundImage("movie", movie.backdrop_path);
}

async function displayShowDetails() {
  const showId = window.location.search.split("=")[1];

  const show = await fetchAPIData(`tv/${showId}`);
  const firstAirDate = new Date(show.first_air_date);
  const showImage = show.poster_path
    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
    : "../images/no-image.jpg";

  const showDetailsEl = document.getElementById("show-details");
  showDetailsEl.innerHTML = `
    <div class="details-top">
      <div>
        <img
          src="${showImage}"
          class="card-img-top"
          alt="${show.name}"
        />
      </div>
      <div>
        <h2>${show.name}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${show.vote_average.toFixed(1)} / 10
        </p>
        <p class="text-muted">Release Date: ${firstAirDate.toLocaleDateString(
          "en-US",
          { timeZone: "UTC", year: "numeric", month: "2-digit", day: "2-digit" }
        )}</p>
        <p>
          ${show.overview}
        </p>
        <h5>Genres</h5>
        <ul class="list-group">
          ${show.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
        </ul>
        <a href="${
          show.homepage
        }" target="_blank" class="btn">Visit Show Homepage</a>
      </div>
    </div>
    <div class="details-bottom">
      <h2>Show Info</h2>
      <ul>
        <li><span class="text-secondary">Number Of Episodes:</span> ${
          show.number_of_episodes
        }</li>
        <li>
          <span class="text-secondary">Last Episode To Air:</span> ${
            show.last_episode_to_air.name
          }
        </li>
        <li><span class="text-secondary">Status:</span> ${show.status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">
        ${show.production_companies
          .map((company) => `<span>${company.name}</span>`)
          .join(", ")}
      </div>
    </div>
  `;

  displayBackgroundImage("show", show.backdrop_path);
}

function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.classList.add("overlay");

  document.querySelector(`#${type}-details`).appendChild(overlayDiv);
}

async function displaySlider() {
  const { results } = await fetchAPIData("movie/now_playing");

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");

    const movieImage = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "../images/no-image.jpg";

    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        <img src="${movieImage}" alt="${movie.title}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(
          1
        )} / 10
      </h4>
    `;

    document.querySelector(".swiper-wrapper").appendChild(div);
    initSwiper();
  });
}

function initSwiper() {
  new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
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

function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Init App
function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displaySlider();
      displayPopularMovies();
      break;
    case "/shows.html":
      displayPopularShows();
      break;
    case "/search.html":
      break;
    case "/tv-details.html":
      displayShowDetails();
      break;
    case "/movie-details.html":
      displayMovieDetails();
      break;
    default:
      break;
  }

  highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
