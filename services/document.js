const { request } = require('../utils/request');

const listDocuments = (domain = '') => request({
  url: `/api/v1/documents${domain ? `?domain=${encodeURIComponent(domain)}` : ''}`,
  method: 'GET',
});

const getDocument = (documentId) => request({
  url: `/api/v1/documents/${documentId}`,
  method: 'GET',
});

module.exports = {
  listDocuments,
  getDocument,
};
