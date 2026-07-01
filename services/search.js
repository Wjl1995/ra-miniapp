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

const listDocumentsByQuery = ({ keyword = '', domain = '', published = '' } = {}) => {
  const params = [];
  if (keyword) {
    params.push(`keyword=${encodeURIComponent(keyword)}`);
  }
  if (domain) {
    params.push(`domain=${encodeURIComponent(domain)}`);
  }
  if (published !== '') {
    params.push(`published=${encodeURIComponent(published)}`);
  }
  return request({
    url: `/api/v1/documents${params.length ? `?${params.join('&')}` : ''}`,
    method: 'GET',
  });
};

const listSuggestions = () => request({
  url: '/api/v1/suggestions',
  method: 'GET',
});

module.exports = {
  searchDocuments,
  listDocumentsByQuery,
  listSuggestions,
};
