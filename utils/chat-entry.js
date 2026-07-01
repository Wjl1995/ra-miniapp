const CHAT_TAB_URL = '/pages/chat/chat';

function normalizeEntry(options = {}) {
  return {
    forceNewSession: Boolean(options.forceNewSession),
    question: options.question || '',
    sessionId: options.sessionId ? Number(options.sessionId) : null,
    documentId: options.documentId ? Number(options.documentId) : null,
  };
}

function openChat(options = {}) {
  const app = getApp();
  app.globalData.pendingChatEntry = normalizeEntry(options);

  return new Promise((resolve, reject) => {
    wx.switchTab({
      url: CHAT_TAB_URL,
      success: resolve,
      fail: reject,
    });
  });
}

function consumePendingChatEntry() {
  const app = getApp();
  const entry = app.globalData.pendingChatEntry || null;
  app.globalData.pendingChatEntry = null;
  return entry;
}

module.exports = {
  CHAT_TAB_URL,
  openChat,
  consumePendingChatEntry,
  normalizeEntry,
};
