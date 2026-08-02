const axios = require('axios');

const DATA_GOV_BASE_URL = 'https://data.gov.sg/api/action/datastore_search';

function createHttpClient({ timeoutMs }) {
  return axios.create({ baseURL: DATA_GOV_BASE_URL, timeout: timeoutMs });
}

module.exports = { createHttpClient, DATA_GOV_BASE_URL };
