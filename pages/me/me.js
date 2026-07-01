const { request } = require('../../utils/request');
const { updateProfile } = require('../../services/profile');

Page({
  data: {
    user: null,
    error: '',
    editing: false,
    saving: false,
    nicknameDraft: '',
    avatarDraft: '',
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
      this.setData({
        user,
        error: '',
        nicknameDraft: user.nickname || '',
        avatarDraft: user.avatar || '',
      });
    } catch (err) {
      this.setData({ error: 'Failed to load profile.' });
    }
  },

  startEditing() {
    const user = this.data.user || {};
    this.setData({
      editing: true,
      nicknameDraft: user.nickname || '',
      avatarDraft: user.avatar || '',
      error: '',
    });
  },

  cancelEditing() {
    const user = this.data.user || {};
    this.setData({
      editing: false,
      nicknameDraft: user.nickname || '',
      avatarDraft: user.avatar || '',
      error: '',
    });
  },

  onNicknameInput(e) {
    this.setData({ nicknameDraft: e.detail.value });
  },

  onAvatarInput(e) {
    this.setData({ avatarDraft: e.detail.value });
  },

  async saveProfile() {
    if (this.data.saving) {
      return;
    }
    this.setData({ saving: true, error: '' });
    try {
      const user = await updateProfile({
        nickname: this.data.nicknameDraft,
        avatar: this.data.avatarDraft,
      });
      const app = getApp();
      app.globalData.user = user;
      wx.setStorageSync('user', user);
      this.setData({
        user,
        editing: false,
        saving: false,
        nicknameDraft: user.nickname || '',
        avatarDraft: user.avatar || '',
      });
    } catch (err) {
      this.setData({
        saving: false,
        error: 'Failed to save profile.',
      });
    }
  },
});
