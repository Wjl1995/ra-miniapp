const { API_BASE_URL } = require('../config/env');

const request = (options) => {
  const app = getApp();
  return new Promise((resolve, reject) => {
    wx.request({
      ...options,
      url: `${API_BASE_URL}${options.url}`,
      header: {
        ...(options.header || {}),
        Authorization: app.globalData.token ? `Bearer ${app.globalData.token}` : '',
      },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
          return;
        }

        if (res.statusCode === 401) {
          app.globalData.token = '';
          app.globalData.user = null;
          wx.removeStorageSync('token');
          wx.removeStorageSync('user');
        }

        reject(res);
      },
      fail(err) {
        reject(err);
      },
    });
  });
};

module.exports = { request };
