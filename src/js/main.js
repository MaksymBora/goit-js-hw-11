import { getTrending } from './get-api.js';
import getRefs from './refs.js';
import { markup } from './markup.js';
import { onLoad, optionsScroll } from './intersection.js';
import { globalVars } from './globalVars.js';
import { showLoadingMessage, hideLoadingMessage } from './loader.js';
import { notifySuccessOrFail } from './notifications.js';
import { countTotalPage } from './countTotalTage.js';

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
    notifySuccessOrFail(response, refs);

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
    countTotalPage(response, intersectionData);

    // start observing page
    observer.observe(refs.targetScroll);

    // observer.observe(refs.targetScroll, page, totalPages, input);
  } catch (error) {
    console.log(error);
  }
}

//clear markup
function clearGallery() {
  const children = Array.from(refs.gallery.children);

  children.forEach(child => {
    refs.gallery.removeChild(child);
  });
}
