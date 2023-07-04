import axios from 'axios';

import getRefs from './refs.js';
import { globalVars } from './globalVars.js';
import { notifyError } from './notifications.js';

const refs = getRefs();

const totalPerPage = globalVars[0].totalPerPage;

// getting API
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
    notifyError(error, refs);
  }
}
