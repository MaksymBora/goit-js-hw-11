// import axios from 'axios';
import { getTrending, totalPerPage } from './get-api.js';
import getRefs from './refs.js';
import { markup } from './markup.js';
import { onLoad, optionsScroll, intersectionData } from './intersection.js';

import Notiflix from 'notiflix';

const refs = getRefs();

let observer = new IntersectionObserver(onLoad, optionsScroll);

refs.searchForm.addEventListener('submit', searchSubmit);

let totalHits = 0;

//
// let totalPages = 0;
// let page = 1;

// let input = '';

// Intersection options
// let optionsScroll = {
//   root: null,
//   rootMargin: '3000px',
//   threshold: 1.0,
// };

// // Intersection
// let observer = new IntersectionObserver(onLoad, optionsScroll);

// async function onLoad(entries, observer) {
//   entries.forEach(async entry => {
//     if (entry.isIntersecting && page <= totalPages) {
//       page += 1;
//       console.log(input);

//       try {
//         const response = await getTrending(page, input);
//         markup(response, refs);

//         if (page === totalPages) {
//           Notiflix.Report.info(
//             'INFO',
//             'We&#8217;re sorry, but you&#x27;ve reached the end of search results.',
//             'Ok',
//             {
//               width: '360px',
//               svgSize: '220px',
//             }
//           );
//           observer.unobserve(refs.targetScroll);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   });
// }

// Listening search(input) and rendering marup
async function searchSubmit(e) {
  e.preventDefault();
  //data form input form
  const inputData = e.target.elements.searchQuery.value;

  intersectionData.input = inputData;

  // default number of first page
  intersectionData.page = 1;

  try {
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
    markup(response, refs);

    if (response) {
      // after rendering markup on the page, scrolling down double the height of card
      onSuccessScroll();
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
  // totalPerPage - imported from /get-api.js
  intersectionData.totalPages = Math.round(totalHits / totalPerPage);
}

//clear markup
function clearGallery() {
  const children = Array.from(refs.gallery.children);

  children.forEach(child => {
    refs.gallery.removeChild(child);
  });
}
