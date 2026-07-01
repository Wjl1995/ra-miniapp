const { createSession, listMessages, sendMessage, listSessions } = require('../../services/chat');
const { consumePendingChatEntry, normalizeEntry } = require('../../utils/chat-entry');

Page({
  data: {
    sessionId: null,
    input: '',
    messages: [],
    sessions: [],
    loading: false,
    error: '',
    documentId: null,
  },

  onLoad(options) {
    this.initialEntry = normalizeEntry({
      question: options.question ? decodeURIComponent(options.question) : '',
      sessionId: options.sessionId,
      documentId: options.documentId,
    });
    this.initialEntryPending = Boolean(
      this.initialEntry.forceNewSession ||
        this.initialEntry.question ||
        this.initialEntry.sessionId ||
        this.initialEntry.documentId,
    );
  },

  async onShow() {
    const app = getApp();
    if (!app.globalData.token) {
      this.setData({
        sessionId: null,
        messages: [],
        sessions: [],
        input: '',
        documentId: null,
        error: 'Please log in from Home first.',
      });
      return;
    }

    const pendingEntry = consumePendingChatEntry();
    if (pendingEntry) {
      await this.enterChat(pendingEntry);
      return;
    }

    if (this.initialEntryPending) {
      this.initialEntryPending = false;
      await this.enterChat(this.initialEntry);
      return;
    }

    if (!this.data.sessionId) {
      await this.enterChat({ forceNewSession: true });
      return;
    }

    await this.refreshMessages();
    await this.loadSessions();
  },

  async refreshMessages() {
    if (!this.data.sessionId) {
      return;
    }
    const messages = await listMessages(this.data.sessionId);
    this.setData({ messages });
  },

  async loadSessions() {
    try {
      const sessions = await listSessions();
      this.setData({ sessions });
    } catch (err) {
      this.setData({ error: 'Failed to load sessions.' });
    }
  },

  async enterChat(entryOptions = {}) {
    const entry = normalizeEntry(entryOptions);
    const shouldCreateSession = entry.forceNewSession || !entry.sessionId;

    this.setData({
      error: '',
      input: entry.question || '',
      documentId: entry.documentId,
    });

    try {
      const nextSessionId = shouldCreateSession
        ? (await createSession(entry.question || entry.documentId ? 'Focused chat' : 'MiniApp session')).id
        : entry.sessionId;

      this.setData({
        sessionId: nextSessionId,
        documentId: entry.documentId,
      });

      await this.loadSessions();
      await this.refreshMessages();

      if (entry.question) {
        await this.submitMessage();
      }
    } catch (err) {
      this.setData({ error: 'Failed to open chat session.' });
    }
  },

  onInput(e) {
    this.setData({ input: e.detail.value });
  },

  async submitMessage() {
    if (!this.data.input || !this.data.sessionId || this.data.loading) {
      return;
    }

    this.setData({ loading: true, error: '' });
    try {
      await sendMessage(this.data.sessionId, this.data.input, this.data.documentId);
      this.setData({ input: '' });
      await this.refreshMessages();
      await this.loadSessions();
    } catch (err) {
      this.setData({ error: 'Failed to send message.' });
    } finally {
      this.setData({ loading: false });
    }
  },

  switchSession(e) {
    const sessionId = Number(e.currentTarget.dataset.id);
    if (!sessionId || sessionId === this.data.sessionId) {
      return;
    }
    this.setData({ sessionId, documentId: null, input: '', error: '' });
    this.refreshMessages();
  },

  async startNewSession() {
    await this.enterChat({ forceNewSession: true });
  },

  manageSessions() {
    wx.navigateTo({
      url: '/pages/chat-sessions/sessions',
    });
  },

  openRefDocument(e) {
    const documentId = Number(e.currentTarget.dataset.documentId);
    if (!documentId) {
      return;
    }
    wx.navigateTo({
      url: `/pages/knowledge-detail/knowledge-detail?id=${documentId}`,
    });
  },
});
