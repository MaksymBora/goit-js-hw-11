import axios from 'axios';

// import cards from '../templates/card.hbs';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';
// import Notiflix from 'notiflix';

const refs = {
  gallery: document.querySelector('.gallery'),
  searchForm: document.querySelector('#search-form'),
  photoCard: document.querySelector('.photo-card'),
  targetScroll: document.querySelector('.js-guard'),
};

refs.searchForm.addEventListener('submit', searchSubmit);

// getting API
const API_KEY = '20403084-138caa44d9b5066c1dd91e458';
const url = 'https://pixabay.com/api/';

let totalHits = 0;
let limit = 40;
let totalPages = 0;

let page = 1;

let optionsScroll = {
  root: null,
  rootMargin: '5900px',
  threshold: 1.0,
};

let input = '';

// Intersection
let observer = new IntersectionObserver(onLoad, optionsScroll);

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting && page <= totalPages) {
      page += 1;

      getTrending(page, input)
        .then(response => {
          markup(response);
          if (page === totalPages) {
            observer.unobserver(refs.targetScroll);
          }
        })
        .catch(error => console.log(error));
    }
  });
}

// Listening search(input) and rendering marup
function searchSubmit(e) {
  e.preventDefault();
  const inputData = e.target.elements.searchQuery.value;

  input = inputData;

  if (refs.photoCard) {
    clearGallery();
    console.log('deleted');
  }

  getTrending(page, inputData)
    .then(response => {
      markup(response);
      observer.observe(refs.targetScroll);
    })
    .catch(error => console.log(error.code));
}

// API data request
function getTrending(page, inputData) {
  return axios
    .get(`${url}/?key=${API_KEY}&q=${inputData}&page=${page}&per_page=${limit}`)
    .then(response => {
      if (response.code === 'ERR_BAD_REQUEST') {
        throw new Error(Error);
      }
      totalHits = response.data.totalHits;
      totalPages = Math.round(totalHits / limit);

      return response;
    });
}

// Create markup
function markup(arr) {
  const dataObj = arr.data.hits;

  for (const key in dataObj) {
    const url = dataObj[key].largeImageURL;
    const likes = dataObj[key].likes;
    const views = dataObj[key].views;
    const comments = dataObj[key].comments;
    const downloads = dataObj[key].downloads;
    // console.log(comments);

    const card = `<div class="photo-card">
         <img src="${url}" alt=""  width="450" height="600"/>
       <div class="info">
     	  <p class="info-item">
     		<b>Likes: </b>${likes}
     	  </p>
     	  <p class="info-item">
     		<b>Views: </b>${views}
     	  </p>
     	  <p class="info-item">
     		<b>Comments: </b>${comments}
     	  </p>
     	  <p class="info-item">
     		<b>Downloads: </b>${downloads}
     	  </p>
       </div>
     </div>
     `;

    refs.gallery.innerHTML += card;
  }
}

//clear markup
function clearGallery() {
  const children = Array.from(refs.gallery.children);
  children.forEach(child => {
    refs.gallery.removeChild(child);
  });
}
