const request = (options) => {
  const app = getApp();
  return new Promise((resolve, reject) => {
    wx.request({
      ...options,
      header: {
        ...(options.header || {}),
        Authorization: app.globalData.token ? `Bearer ${app.globalData.token}` : '',
      },
      success: resolve,
      fail: reject,
    });
  });
};

module.exports = { request };
