const { createSession, listMessages, sendMessage } = require('../../services/chat');

Page({
  data: {
    sessionId: null,
    input: '',
    messages: [],
    loading: false,
    error: '',
    documentId: null,
  },

  async onLoad(options) {
    const presetQuestion = options.question ? decodeURIComponent(options.question) : '';
    const documentId = options.documentId ? Number(options.documentId) : null;
    try {
      const session = await createSession('MiniApp session');
      this.setData({ sessionId: session.id, input: presetQuestion, documentId });
      if (presetQuestion) {
        await this.submitMessage();
      }
    } catch (err) {
      this.setData({ error: 'Failed to create session.' });
    }
  },

  async refreshMessages() {
    if (!this.data.sessionId) {
      return;
    }
    const messages = await listMessages(this.data.sessionId);
    this.setData({ messages });
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
    } catch (err) {
      this.setData({ error: 'Failed to send message.' });
    } finally {
      this.setData({ loading: false });
    }
  },
});
