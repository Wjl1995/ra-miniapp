const { listSessions, createSession } = require('../../services/chat');
const { openChat } = require('../../utils/chat-entry');

Page({
  data: {
    sessions: [],
    error: '',
    loading: false,
  },

  async onShow() {
    await this.loadSessions();
  },

  async loadSessions() {
    try {
      const sessions = await listSessions();
      this.setData({ sessions, error: '' });
    } catch (err) {
      this.setData({ error: 'Failed to load sessions.' });
    }
  },

  async openSession(e) {
    const sessionId = e.currentTarget.dataset.id;
    await openChat({ sessionId });
  },

  async createNewSession() {
    if (this.data.loading) {
      return;
    }

    this.setData({ loading: true, error: '' });
    try {
      const session = await createSession('MiniApp session');
      await openChat({ sessionId: session.id });
    } catch (err) {
      this.setData({ error: 'Failed to create session.' });
    } finally {
      this.setData({ loading: false });
    }
  },
});
