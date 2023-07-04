import { getTrending } from './get-api.js';
import getRefs from './refs.js';
import { markup } from './markup.js';
import { onLoad, optionsScroll } from './intersection.js';
import Notiflix from 'notiflix';
import { globalVars } from './globalVars.js';
import { showLoadingMessage, hideLoadingMessage } from './loader.js';

const refs = getRefs();

const intersectionData = globalVars[0];

refs.searchForm.addEventListener('submit', searchSubmit);

// Intersection observer of infinity scroll
let observer = new IntersectionObserver(onLoad, optionsScroll);

// Listening search(input) and rendering marup
async function searchSubmit(e) {
  e.preventDefault();
  //data form input form
  const inputData = e.target.elements.searchQuery.value;

  intersectionData.input = inputData;

  // default number of first page
  intersectionData.page = 1;

  try {
    showLoadingMessage(refs);

    // receiving object with our requested (inputData)
    const response = await getTrending(intersectionData.page, inputData);

    // card that rendering function markup
    const photoCard = document.querySelector('.photo-card');

    // if markup exists in .gallery => remove all markup
    if (photoCard) {
      clearGallery();
    }

    // notifying about unsuccessful search or success
    notification(response);

    // call markup
    markup(response);

    if (response) {
      // after rendering markup on the page, scrolling down double the height of card
      hideLoadingMessage(refs);
    }

    if (response.code === 'ERR_BAD_REQUEST') {
      throw new Error(response.code);
    }

    // calculate total pages after receiving object
    countTotalPage(response);

    // start observing page
    observer.observe(refs.targetScroll);

    // observer.observe(refs.targetScroll, page, totalPages, input);
  } catch (error) {
    console.log(error);
  }
}

// // Show loading message
// function showLoadingMessage() {
//   refs.loadingMessage.style.display = 'block';
// }

// // Hide loading message
// function hideLoadingMessage() {
//   refs.loadingMessage.style.display = 'none';
// }

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

// Count total pages of received data
function countTotalPage(response) {
  let totalImg = response.data.totalHits;
  intersectionData.totalHits = totalImg;

  // totalPerPage - imported from /get-api.js
  intersectionData.totalPages = Math.round(
    intersectionData.totalHits / intersectionData.totalPerPage
  );
}

//clear markup
function clearGallery() {
  const children = Array.from(refs.gallery.children);

  children.forEach(child => {
    refs.gallery.removeChild(child);
  });
}
