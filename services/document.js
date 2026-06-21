const { request } = require('../utils/request');
const { API_BASE_URL } = require('../config/env');

const listDocuments = (domain = '') => request({
  url: `/api/v1/documents${domain ? `?domain=${encodeURIComponent(domain)}` : ''}`,
  method: 'GET',
});

const getDocument = (documentId) => request({
  url: `/api/v1/documents/${documentId}`,
  method: 'GET',
});

const uploadDocument = ({ filePath, name, domain = 'general', tags = '' }) => {
  const app = getApp();
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${API_BASE_URL}/api/v1/documents`,
      filePath,
      name: 'file',
      formData: {
        domain,
        tags,
        title: name || '',
      },
      header: {
        Authorization: app.globalData.token ? `Bearer ${app.globalData.token}` : '',
      },
      success(res) {
        const data = res.data ? JSON.parse(res.data) : null;
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
          return;
        }
        reject({ statusCode: res.statusCode, data, fileName: name });
      },
      fail(err) {
        reject(err);
      },
    });
  });
};

module.exports = {
  listDocuments,
  getDocument,
  uploadDocument,
};
