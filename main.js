const API_KEY = "T6N0SC8-3H6MD0T-MN5767G-J1H0GC5";
const API_URL_POPULAR =
  "https://api.kinopoisk.dev/v1.4/movie?page=1&limit=20&rating.kp=2-10&rating.imdb=8-10";
const API_URL_SEARCH =
  "https://api.kinopoisk.dev/v1.4/movie/search?page=1&limit=10&query=";

const moviesContainer = document.querySelector('.movies');
const moviesFragment = document.createDocumentFragment();
const searchInput = document.querySelector("#header__search");
const searchButton = document.querySelector(".search__button");

const modal = document.querySelector('.modal');
const modalClosingElement = modal.querySelector('.modal__cancel');
const isEscapeKey = (evt) => evt.key === 'Escape';


async function getMovies(url) {
  let response;
  try {
  response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
        if (!response.ok) {
      throw new Error(`${response.status} — ${response.statusText}`);
    }
  const respData = await response.json();
  const moviesArray = respData.docs;
    
  console.log(moviesArray);
  createMovieThumbnail(moviesArray);
  showModal(moviesArray);
}
 catch (error) {
      console.log(`Поймали ошибку! Вот она: ${error.message}`);
}
}

function getClassByRate (thumbnail, rate) {
  if (rate >= 7) {
       thumbnail.querySelector('.movie__rating').style.background = '#34C759';
    } else 
      if (rate < 7 && rate >= 5) {
       thumbnail.querySelector('.movie__rating').style.background = '#9B9B9B';
    } else 
      if (rate < 5 && rate > 0) {
       thumbnail.querySelector('.movie__rating').style.background = '#E82424';
    } 
}

const createMovieThumbnail = (moviesArray) => {
  
  for (let i = 0; i < moviesArray.length; i++) {
  const movieTemplate = document.querySelector('#movie').content.querySelector('.movie__thumbnail');
  const movieThumbnail = movieTemplate.cloneNode(true);
    
  if (moviesArray[i].hasOwnProperty('poster')) {
      movieThumbnail.querySelector('.movie__img').src = moviesArray[i].poster.previewUrl;
    } else {
       movieThumbnail.querySelector('.movie__img').src = "https://basetop.ru/wp-content/uploads/2022/12/cvvmcx4e-1.jpg"
    }
    movieThumbnail.dataset.movieId = moviesArray[i].id;
    movieThumbnail.querySelector('.movie__img').alt =  moviesArray[i].name;
    movieThumbnail.querySelector('.movie__name').innerHTML  =  moviesArray[i].name;
    
    if (moviesArray[i].rating.kp !== 0) {
      movieThumbnail.querySelector('.movie__rating').innerHTML  =  Math.round(moviesArray[i].rating.kp * 10) / 10;
    }
      
  movieThumbnail.querySelector('.movie__details').innerHTML  = `${moviesArray[i].year}, ${moviesArray[i].genres[0].name}`;
  getClassByRate(movieThumbnail, moviesArray[i].rating.kp);
  moviesFragment.append(movieThumbnail);
  moviesContainer.append(moviesFragment);

}
}

searchButton.addEventListener("click", () => {
  const currentMovies = document.querySelectorAll(".movie__thumbnail");
  const apiSearchUrl = `${API_URL_SEARCH}${searchInput.value}`;
 
  for (let i = 0; i < currentMovies.length; i++) {
 currentMovies[i].remove();
}
  
  getMovies(apiSearchUrl);
  searchInput.value = "";
});

const onEscKeydown = (evt) => {
  evt.preventDefault();
  if (isEscapeKey(evt)) {
    closeModal();
  }
};

const onModalClosingClick = () => closeModal();

function closeModal() {
  modal.classList.add('hidden');
  document.removeEventListener('keydown', onEscKeydown);
  document.removeEventListener('click', onModalClosingClick);
}

const openModal = () => {
 modal.classList.remove('hidden');
 document.addEventListener('keydown', onEscKeydown);
 modalClosingElement.addEventListener('click', onModalClosingClick);
};

const onThumbnailClick = (array) => (evt) => {
  const currentMovieThumbnail = evt.target.closest('.movie__thumbnail');
  const movieId = currentMovieThumbnail.dataset.movieId;
  const currentMovie = array.find((item) => item.id === Number(movieId));
  console.log(currentMovie);
 
  let movieAgeRating = currentMovie.ageRating;
  if (currentMovie.hasOwnProperty ("ageRating") && movieAgeRating !== null) {
      movieAgeRating += '+';
  } else {
    movieAgeRating = '';
  }
  
  
  
  const getMovieLength = (movieLength, seriesLength) => {
      if (movieLength !== null) {
      return movieLength = currentMovie.movieLength + 'мин.';
  } else if (seriesLength !== null) {
      seriesLength = currentMovie.seriesLength + 'мин.';
  } else {
    seriesLength = '';
  };
    return seriesLength;
  }

  const getMovieGenres = (currentMovieGenresArray) => {
    let movieGenres = [];
    for (let i = 0; i < currentMovieGenresArray.length; i++){
    const genre = Object.values(currentMovieGenresArray[i]);
    movieGenres.push(genre);
}
    return movieGenresNames = movieGenres.join(', ');
  }
  const currentMovieGenres = getMovieGenres(currentMovie.genres);
  const currentMoveLength = getMovieLength(currentMovie.movieLength, currentMovie.seriesLength);

  
   modal.querySelector('.movie__img').src =  currentMovie.poster.previewUrl;
   modal.querySelector('.movie__img').alt =  currentMovie.name;
   modal.querySelector('.movie__title').innerHTML  =  currentMovie.name;
  modal.querySelector('.movie__title-original').innerHTML  =  currentMovie.alternativeName;
  modal.querySelector('.movie__details').innerHTML  = `${currentMovie.year}, ${currentMovieGenres}, ${currentMovie.countries[0].name}, ${currentMoveLength} ${movieAgeRating}`; 
  modal.querySelector('.movie__summary').innerHTML  =  currentMovie.description || currentMovie.shortDescription || '';
  modal.querySelector('.rating__IMDB .rating-value').innerHTML = Math.round(currentMovie.rating.imdb * 10) / 10;
  modal.querySelector('.rating__kinopoisk .rating-value').innerHTML = Math.round(currentMovie.rating.kp * 10) / 10;
   modal.querySelector('.movie__title').innerHTML  =  currentMovie.name;
 
  openModal();
};

const showModal = (array) => {
  moviesContainer.addEventListener ('click', onThumbnailClick(array));
};

getMovies(API_URL_POPULAR);