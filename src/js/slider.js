// let modalImg = new SimpleLightbox('.gallery a', {
//   doubleTapZoom: '1.5',
//   captionsData: 'data-parent',
//   captionDelay: 250,
//   widthRatio: 1.5,
// });

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export const slider = [
  {
    modalImg: new SimpleLightbox('.gallery a', {
      doubleTapZoom: '1.5',
      captionsData: 'data-parent',
      captionDelay: 250,
      widthRatio: 1.5,
    }),
  },
];
