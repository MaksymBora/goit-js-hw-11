import axios from 'axios';
import Notiflix from 'notiflix';
import getRefs from './refs.js';

const refs = getRefs();

export let totalPerPage = 40;

// getting API

// 20403084-138caa44d9b5066c1dd91e458
const API_KEY = '38051155-55c7a09781d6cf5219707538c';
const url = 'https://pixabay.com/api/';

// API data request
export async function getTrending(page = 1, inputData) {
  try {
    const getData = await axios.get(
      `${url}/?key=${API_KEY}&q=${inputData}&page=${page}&per_page=${totalPerPage}`
    );
    return getData;
  } catch (error) {
    notifyError(error);
  }
}

// errro notification message
function notifyError(error) {
  refs.searchForm.reset();
  Notiflix.Notify.failure(`${error}`, {
    timeout: 6000,
  });
}
