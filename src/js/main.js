import axios from 'axios';
// import cards from '../templates/card.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const refs = {
  gallery: document.querySelector('.gallery'),
  searchForm: document.querySelector('#search-form'),

  targetScroll: document.querySelector('.js-guard'),
};

refs.searchForm.addEventListener('submit', searchSubmit);

// getting API
const API_KEY = '20403084-138caa44d9b5066c1dd91e458';
const url = 'https://pixabay.com/api/';

let totalHits = 0;
let totalPerPage = 40;
let totalPages = 0;

let page = 1;

let input = '';

// API data request
async function getTrending(page = 1, inputData) {
  try {
    const getData = await axios.get(
      `${url}/?key=${API_KEY}&q=${inputData}&page=${page}&per_page=${totalPerPage}`
    );
    return getData;
  } catch (error) {
    notifyError(error);
  }
}

// errro notification message
function notifyError(error) {
  refs.searchForm.reset();
  Notiflix.Notify.failure(`${error}`, {
    timeout: 6000,
  });
}

// Intersection options
let optionsScroll = {
  root: null,
  rootMargin: '3000px',
  threshold: 1.0,
};

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
            Notiflix.Report.info(
              'INFO',
              'We&#8217are sorry, but you&#x27ve reached the end of search results.',
              'Ok',
              {
                width: '360px',
                svgSize: '220px',
              }
            );
            observer.unobserve(refs.targetScroll);
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

  //data form input form
  input = inputData;

  // default number of first page
  page = 1;

  // receiving object with our requested (inputData)
  getTrending(page, inputData)
    .then(response => {
      // card that rendering function markup
      const photoCard = document.querySelector('.photo-card');

      // if markup exist in .gallery => remove all markup
      if (photoCard) {
        clearGallery();
      }

      // notifying about unsuccess search or success.
      notification(response);

      // call markup
      markup(response);

      // after rendering markup on the page, scrolling down double height of card
      onSuccessScroll();

      if (response.code === 'ERR_BAD_REQUEST') {
        throw new Error(Error);
      }

      // calculate total pages after receiveing object
      countTotalPage(response);

      // start observing page
      observer.observe(refs.targetScroll);
    })
    .catch(error => console.log(error.code));
}

function notification(response) {
  // if you reached last image in the list(object)
  if (response.data.totalHits === 0) {
    // clear data from input
    refs.searchForm.reset();

    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    // clear data from input
    refs.searchForm.reset();

    Notiflix.Notify.success(
      `Hooray! We found ${response.data.totalHits} images.`,
      {
        timeout: 3000,
      }
    );
  }
}

// Create markup
function markup(arr) {
  const dataObj = arr.data.hits;

  for (const key in dataObj) {
    const {
      webformatURL,
      likes,
      views,
      comments,
      downloads,
      tags,
      largeImageURL,
    } = dataObj[key];

    const url = webformatURL;
    const totalLikes = likes;
    const totalViews = views;
    const totalComments = comments;
    const totalDownloads = downloads;
    const tag = tags;
    const urlBig = largeImageURL;

    const card = `<div class="photo-card">
         <a class="card-item" href="${urlBig}"><img class="card-img" src="${url}" alt="${tag}" data-parent="<b>Likes: </b>${totalLikes} <b>Comments: </b>${totalComments} <b>Downloads: </b>${totalDownloads} <b>Views: </b>${totalViews}" width="300" height="200"/>
       <div class="info">
     	  <p class="info-item">
     		<i class="fa-regular fa-heart"></i> ${totalLikes}
     	  </p>
     	  <p class="info-item">
     		<i class="fa-solid fa-comment"></i> ${totalComments}
     	  </p>
     	  <p class="info-item">
     		<i class="fa-solid fa-download"></i> ${totalDownloads}
     	  </p>
        <p class="info-item">
     		<b>Views: </b>${totalViews}
     	  </p>
       </div>
       </a>
     </div>
     `;

    refs.gallery.innerHTML += card;
    let modalImg = new SimpleLightbox('.gallery a', {
      doubleTapZoom: '1.5',
      captionsData: 'data-parent',
      captionDelay: 250,
      widthRatio: 1.5,
    });
    if (modalImg) {
      modalImg.refresh();
    }
  }
}

// After rendering scrolling down two times of card height
function onSuccessScroll() {
  // double scroll
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

// Count total pages of received data
function countTotalPage(response) {
  totalHits = response.data.totalHits;
  totalPages = Math.round(totalHits / totalPerPage);
}

//clear markup
function clearGallery() {
  const children = Array.from(refs.gallery.children);

  children.forEach(child => {
    refs.gallery.removeChild(child);
  });
}
