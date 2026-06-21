const { listDocuments, uploadDocument } = require('../../services/document');

Page({
  data: {
    documents: [],
    filteredDocuments: [],
    error: '',
    uploading: false,
    uploadHint: '',
    keyword: '',
  },

  async onShow() {
    await this.loadDocuments();
  },

  async loadDocuments() {
    try {
      const documents = await listDocuments();
      this.setData({ documents, error: '' });
      this.applyFilters(documents, this.data.keyword);
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

  async chooseAndUpload() {
    if (this.data.uploading) {
      return;
    }

    try {
      const picked = await this.chooseMessageFile();
      const file = picked.tempFiles && picked.tempFiles[0];
      if (!file) {
        this.setData({ error: 'No file selected.' });
        return;
      }

      this.setData({
        uploading: true,
        uploadHint: `Uploading ${file.name || 'document'}...`,
        error: '',
      });

      await uploadDocument({
        filePath: file.path,
        name: file.name || 'document',
        domain: 'general',
        tags: '',
      });

      this.setData({
        uploading: false,
        uploadHint: `Upload completed: ${file.name || 'document'}`,
      });
      await this.loadDocuments();
    } catch (err) {
      if (err && err.errMsg && err.errMsg.includes('cancel')) {
        this.setData({
          uploading: false,
          uploadHint: '',
        });
        return;
      }

      this.setData({
        uploading: false,
        uploadHint: '',
        error: this.formatUploadError(err),
      });
    }
  },

  chooseMessageFile() {
    return new Promise((resolve, reject) => {
      wx.chooseMessageFile({
        count: 1,
        type: 'file',
        extension: ['md', 'txt', 'pdf', 'docx', 'pptx', 'xlsx'],
        success: resolve,
        fail: reject,
      });
    });
  },

  formatUploadError(err) {
    if (err && err.data && typeof err.data === 'object' && err.data.detail) {
      return `Upload failed: ${err.data.detail}`;
    }
    if (err && err.errMsg) {
      return `Upload failed: ${err.errMsg}`;
    }
    return 'Failed to upload document.';
  },

  onKeywordInput(e) {
    const keyword = e.detail.value || '';
    this.setData({ keyword });
    this.applyFilters(this.data.documents, keyword);
  },

  clearKeyword() {
    this.setData({ keyword: '' });
    this.applyFilters(this.data.documents, '');
  },

  applyFilters(documents, keyword) {
    const normalized = (keyword || '').trim().toLowerCase();
    const filteredDocuments = !normalized
      ? documents
      : documents.filter((item) => {
          const haystack = `${item.title} ${item.domain} ${item.summary || ''}`.toLowerCase();
          return haystack.includes(normalized);
        });
    this.setData({ filteredDocuments });
  },

  formatFileSize(size) {
    if (!size) {
      return '0 B';
    }
    if (size < 1024) {
      return `${size} B`;
    }
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  },
});
