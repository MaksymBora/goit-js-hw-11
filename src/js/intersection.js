import Notiflix from 'notiflix';
import getRefs from './refs.js';
import { getTrending } from './get-api.js';
import { markup } from './markup.js';

const refs = getRefs();

export async function onLoad(entries, observer, page, totalPages, input) {
  entries.forEach(async entry => {
    if (entry.isIntersecting && page <= totalPages) {
      page += 1;
      console.log(input);

      try {
        const response = await getTrending(page, input);
        markup(response, refs);

        if (page === totalPages) {
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

// создание IntersectionObserver
export function createIntersectionObserver() {
  const optionsScroll = {
    root: null,
    rootMargin: '3000px',
    threshold: 1.0,
  };

  return new IntersectionObserver(onLoad, optionsScroll);
}
