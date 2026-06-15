const { login } = require('../../utils/auth');
const { listSuggestions } = require('../../services/search');

Page({
  data: {
    user: null,
    suggestions: [],
    error: '',
  },

  async onShow() {
    const app = getApp();
    this.setData({ user: app.globalData.user });
    if (app.globalData.token) {
      await this.loadSuggestions();
    }
  },

  async handleLogin() {
    try {
      const result = await login();
      this.setData({ user: result.user, error: '' });
      await this.loadSuggestions();
    } catch (err) {
      this.setData({ error: 'Login failed. Check backend availability.' });
    }
  },

  async loadSuggestions() {
    try {
      const suggestions = await listSuggestions();
      this.setData({ suggestions, error: '' });
    } catch (err) {
      this.setData({ error: 'Failed to load suggestions.' });
    }
  },

  goChat(e) {
    const question = e.currentTarget.dataset.question || '';
    wx.navigateTo({
      url: `/pages/chat/chat?question=${encodeURIComponent(question)}`,
    });
  },
});
