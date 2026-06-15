const { getDocument } = require('../../services/document');

Page({
  data: {
    document: null,
    error: '',
  },

  async onLoad(options) {
    if (!options.id) {
      this.setData({ error: 'Missing document id.' });
      return;
    }
    try {
      const document = await getDocument(options.id);
      this.setData({ document, error: '' });
    } catch (err) {
      this.setData({ error: 'Failed to load document.' });
    }
  },

  askFromDocument() {
    const documentId = this.data.document ? this.data.document.id : '';
    wx.navigateTo({
      url: `/pages/chat/chat?documentId=${documentId}`,
    });
  },
});
