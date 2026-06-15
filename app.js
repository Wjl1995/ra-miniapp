App({
  globalData: {
    token: '',
    user: null,
  },

  onLaunch() {
    const token = wx.getStorageSync('token') || '';
    const user = wx.getStorageSync('user') || null;
    this.globalData.token = token;
    this.globalData.user = user;
  },
});
