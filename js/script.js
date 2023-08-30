const global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    apiKey: "cdcf2eb8667da4906eecdcb1b34638ee",
    apiUrl: "https://api.themoviedb.org/3/",
  },
  dateOptions: {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  },
};

async function displayPopularMovies() {
  const { results } = await fetchAPIData("movie/popular");

  results.forEach((movie) => {
    const releaseDate = movie.release_date
      ? new Date(movie.release_date).toLocaleDateString(
          "en-US",
          global.dateOptions
        )
      : "N/A";
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
            <small class="text-muted">Release: ${releaseDate}</small>
          </p>
        </div>
    `;

    document.getElementById("popular-movies").appendChild(div);
  });
}

async function displayPopularShows() {
  const { results } = await fetchAPIData("tv/popular");

  results.forEach((show) => {
    const firstAirDate = show.first_air_date
      ? new Date(show.first_air_date).toLocaleDateString(
          "en-US",
          global.dateOptions
        )
      : "N/A";
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
              <small class="text-muted">Release: ${firstAirDate}</small>
            </p>
          </div>
      `;

    document.getElementById("popular-shows").appendChild(div);
  });
}

async function displayMovieDetails() {
  const movieId = window.location.search.split("=")[1];

  const movie = await fetchAPIData(`movie/${movieId}`);
  const releaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString(
        "en-US",
        global.dateOptions
      )
    : "N/A";
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
        <p class="text-muted">Release Date: ${releaseDate}</p>
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
  const firstAirDate = show.first_air_date
    ? new Date(show.first_air_date).toLocaleDateString(
        "en-US",
        global.dateOptions
      )
    : "N/A";
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
        <p class="text-muted">Release Date: ${firstAirDate}</p>
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

async function displaySearchResults() {
  document.getElementById("search-results").innerHTML = "";

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  global.search.type = urlParams.get("type") ?? "";
  global.search.term = urlParams.get("search-term") ?? "";

  if (global.search.term !== "") {
    const { results, total_pages, page, total_results } = await searchAPIData();

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    if (results.length === 0) {
      showAlert("No results found", "alert-error");
      return;
    }

    results.forEach((result) => {
      const releaseDate =
        global.search.type === "movie"
          ? result.release_date
            ? new Date(result.release_date).toLocaleDateString(
                "en-US",
                global.dateOptions
              )
            : "N/A"
          : result.first_air_date
          ? new Date(result.first_air_date).toLocaleDateString(
              "en-US",
              global.dateOptions
            )
          : "N/A";
      const resultImage = result.poster_path
        ? `https://image.tmdb.org/t/p/w500${result.poster_path}`
        : "../images/no-image.jpg";
      const div = document.createElement("div");
      div.classList.add("card");
      div.innerHTML = `
          <a href="${global.search.type}-details.html?id=${result.id}">
            <img
              src="${resultImage}"
              class="card-img-top"
              alt="${
                global.search.type === "movie" ? result.title : result.name
              }"
            />
          </a>
          <div class="card-body">
            <h5 class="card-title">${
              global.search.type === "movie" ? result.title : result.name
            }</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${releaseDate}</small>
            </p>
          </div>
      `;

      document.getElementById("search-results").appendChild(div);
    });

    document.getElementById("search-term").value = "";
    document.getElementById("search-results-heading").innerHTML = `
      <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>
    `;

    displayPagination();
  } else {
    showAlert("Please enter a search term", "alert-error");
  }
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

async function fetchAPIData(endpoint) {
  showSpinner();

  const response = await fetch(
    `${global.api.apiUrl}${endpoint}?api_key=${global.api.apiKey}&language=en-US`
  );
  const data = await response.json();

  hideSpinner();
  return data;
}

async function searchAPIData() {
  showSpinner();

  const response = await fetch(
    `${global.api.apiUrl}search/${global.search.type}?api_key=${global.api.apiKey}&language=en-US&query=${global.search.term}&page=${global.search.page}`
  );
  const data = await response.json();

  hideSpinner();
  return data;
}

function displayPagination() {
  document.getElementById("pagination").innerHTML = "";

  const div = document.createElement("div");
  div.classList.add("pagination");
  div.innerHTML = `
    <button class="btn btn-primary" id="prev">Prev</button>
    <button class="btn btn-primary" id="next">Next</button>
    <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
  `;

  document.getElementById("pagination").appendChild(div);

  if (global.search.page === 1) {
    document.getElementById("prev").disabled = true;
  }

  if (global.search.page === global.search.totalPages) {
    document.getElementById("next").disabled = true;
  }

  document.getElementById("next").addEventListener("click", async () => {
    global.search.page++;
    await displaySearchResults();
  });

  document.getElementById("prev").addEventListener("click", async () => {
    global.search.page--;
    await displaySearchResults();
  });
}

function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.classList.add("overlay");

  document.querySelector(`#${type}-details`).appendChild(overlayDiv);
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

function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}

function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

function highlightActiveLink() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  });
}

function showAlert(message, className) {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert");

  if (className) {
    alertEl.classList.add(className);
  }
  alertEl.appendChild(document.createTextNode(message));

  document.getElementById("alert").appendChild(alertEl);

  setTimeout(() => {
    document.getElementById("alert").removeChild(alertEl);
  }, 3000);
}

function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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
      displaySearchResults();
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
