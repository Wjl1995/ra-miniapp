const { request } = require('../../utils/request');

Page({
  data: {
    user: null,
    error: '',
  },

  async onShow() {
    const app = getApp();
    if (app.globalData.user) {
      this.setData({ user: app.globalData.user });
      return;
    }

    if (!app.globalData.token) {
      this.setData({ user: null });
      return;
    }

    try {
      const user = await request({
        url: '/api/v1/me/profile',
        method: 'GET',
      });
      app.globalData.user = user;
      wx.setStorageSync('user', user);
      this.setData({ user, error: '' });
    } catch (err) {
      this.setData({ error: 'Failed to load profile.' });
    }
  },
});
