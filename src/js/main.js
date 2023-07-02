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
let limit = 40;
let totalPages = 0;

let page = 1;

let optionsScroll = {
  root: null,
  rootMargin: '3000px',
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

  input = inputData;
  page = 1;

  getTrending(page, inputData)
    .then(response => {
      const photoCard = document.querySelector('.photo-card');
      if (photoCard) {
        clearGallery();
      }

      if (response.data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notiflix.Notify.success(
          `Hooray! We found ${response.data.totalHits} images.`,
          {
            timeout: 3000,
          }
        );
      }

      markup(response);

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });

      if (response.code === 'ERR_BAD_REQUEST') {
        throw new Error(Error);
      }
      refs.searchForm.reset();
      totalHits = response.data.totalHits;
      totalPages = Math.round(totalHits / limit);

      observer.observe(refs.targetScroll);
    })
    .catch(error => console.log(error.code));
}

// API data request
async function getTrending(page = 1, inputData) {
  try {
    const getData = await axios.get(
      `${url}/?key=${API_KEY}&q=${inputData}&page=${page}&per_page=${limit}`
    );
    return getData;
  } catch (error) {
    refs.searchForm.reset();
    Notiflix.Notify.failure(`${error}`, {
      timeout: 6000,
    });
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
    });
    if (modalImg) {
      modalImg.refresh();
    }
  }

  const container = document.body;
  container.style.overflowY = 'initial';
}

//clear markup
function clearGallery() {
  const children = Array.from(refs.gallery.children);

  children.forEach(child => {
    refs.gallery.removeChild(child);
  });
}
