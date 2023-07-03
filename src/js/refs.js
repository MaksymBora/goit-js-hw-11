function getRefs() {
  return {
    gallery: document.querySelector('.gallery'),
    searchForm: document.querySelector('#search-form'),
    targetScroll: document.querySelector('.js-guard'),
    loadingMessage: document.querySelector('.loader'),
  };
}

export default getRefs;
