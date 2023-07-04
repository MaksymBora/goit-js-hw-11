import { getTrending } from './get-api.js';
import { markup } from './markup.js';
import Notiflix from 'notiflix';
import getRefs from './refs.js';

const refs = getRefs();
let totalPages = 0;
let page = 1;
let input = '';

export const intersectionData = {
  page,
  totalPages,
  input,
};

export const optionsScroll = {
  root: null,
  rootMargin: '2000px',
  threshold: 1.0,
};

export async function onLoad(entries, observer) {
  entries.forEach(async entry => {
    if (
      entry.isIntersecting &&
      intersectionData.page <= intersectionData.totalPages
    ) {
      intersectionData.page += 1;

      try {
        const response = await getTrending(
          intersectionData.page,
          intersectionData.input
        );

        markup(response);

        if (intersectionData.page === intersectionData.totalPages) {
          Notiflix.Report.info(
            'INFO',
            'We&#8217;re sorry, but you&#x27;ve reached the end of search results.',
            'Ok',
            {
              width: '360px',
              svgSize: '220px',
            }
          );
          observer.unobserve(refs.targetScroll);
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
}
