import { getTrending } from './get-api.js';
import { renderingImgList } from './renderingImgList.js';
import getRefs from './refs.js';
import { reachedLastPage } from './notifications.js';

import { globalVars } from './globalVars.js';

const refs = getRefs();

const intersectionData = globalVars[0];

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
          intersectionData.input,
          refs
        );

        renderingImgList(response, refs);

        if (intersectionData.page === intersectionData.totalPages) {
          reachedLastPage();
          observer.unobserve(refs.targetScroll);
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
}
