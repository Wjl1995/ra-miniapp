const { login } = require('../../utils/auth');
const { listSuggestions, searchDocuments } = require('../../services/search');
const { listDocuments } = require('../../services/document');
const { listSessions } = require('../../services/chat');
const { openChat } = require('../../utils/chat-entry');

Page({
  data: {
    user: null,
    suggestions: [],
    sessions: [],
    recentDocuments: [],
    searchQuery: '',
    searchResults: [],
    error: '',
  },

  async onShow() {
    const app = getApp();
    this.setData({ user: app.globalData.user });
    if (app.globalData.token) {
      await this.loadSuggestions();
      await this.loadSessions();
      await this.loadRecentDocuments();
    }
  },

  async handleLogin() {
    try {
      const result = await login();
      this.setData({ user: result.user, error: '' });
      await Promise.all([this.loadSuggestions(), this.loadSessions(), this.loadRecentDocuments()]);
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

  async loadSessions() {
    try {
      const sessions = await listSessions();
      this.setData({ sessions, error: '' });
    } catch (err) {
      this.setData({ error: 'Failed to load sessions.' });
    }
  },

  async loadRecentDocuments() {
    try {
      const recentDocuments = await listDocuments({ published: '' });
      this.setData({ recentDocuments: recentDocuments.slice(0, 3), error: '' });
    } catch (err) {
      this.setData({ error: 'Failed to load recent documents.' });
    }
  },

  async onSearchInput(e) {
    const searchQuery = e.detail.value || '';
    this.setData({ searchQuery });
    if (!searchQuery.trim()) {
      this.setData({ searchResults: [] });
      return;
    }

    try {
      const searchResults = await searchDocuments(searchQuery, 5);
      this.setData({ searchResults, error: '' });
    } catch (err) {
      this.setData({ error: 'Failed to search documents.' });
    }
  },

  async goChat(e) {
    const question = e.currentTarget.dataset.question || '';
    await openChat({
      forceNewSession: true,
      question,
    });
  },

  async openSession(e) {
    const sessionId = e.currentTarget.dataset.id;
    await openChat({ sessionId });
  },

  openSessionsPage() {
    wx.navigateTo({
      url: '/pages/chat-sessions/sessions',
    });
  },

  async startNewChat() {
    await openChat({ forceNewSession: true });
  },

  async continueLatestSession() {
    const latestSession = this.data.sessions[0];
    if (!latestSession) {
      await this.startNewChat();
      return;
    }
    await openChat({ sessionId: latestSession.id });
  },

  browseDocuments() {
    wx.switchTab({
      url: '/pages/knowledge/knowledge',
    });
  },

  async askDocument(e) {
    const documentId = Number(e.currentTarget.dataset.id);
    if (!documentId) {
      return;
    }
    await openChat({
      forceNewSession: true,
      documentId,
    });
  },

  openDocument(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/knowledge-detail/knowledge-detail?id=${id}`,
    });
  },
});
