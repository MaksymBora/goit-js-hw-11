import Notiflix from 'notiflix';
import getRefs from './refs.js';

const refs = getRefs();

export let totalPages = 0;
export let page = 1;
export let input = '';

// Intersection options
let optionsScroll = {
  root: null,
  rootMargin: '3000px',
  threshold: 1.0,
};

// Intersection
export let observer = new IntersectionObserver(onLoad, optionsScroll);

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
