const { request } = require('../utils/request');

const searchDocuments = (q = '', topK = 5, domain = '') => {
  const params = [`q=${encodeURIComponent(q)}`, `top_k=${topK}`];
  if (domain) {
    params.push(`domain=${encodeURIComponent(domain)}`);
  }
  return request({
    url: `/api/v1/search?${params.join('&')}`,
    method: 'GET',
  });
};

const listSuggestions = () => request({
  url: '/api/v1/suggestions',
  method: 'GET',
});

module.exports = {
  searchDocuments,
  listSuggestions,
};
