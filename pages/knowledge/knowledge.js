const { listDocuments } = require('../../services/document');

Page({
  data: {
    documents: [],
    error: '',
  },

  async onShow() {
    try {
      const documents = await listDocuments();
      this.setData({ documents, error: '' });
    } catch (err) {
      this.setData({ error: 'Failed to load documents.' });
    }
  },

  openDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/knowledge-detail/knowledge-detail?id=${id}`,
    });
  },
});
