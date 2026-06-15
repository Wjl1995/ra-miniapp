const { request } = require('../utils/request');

const listSessions = () => request({
  url: '/api/v1/chat/sessions',
  method: 'GET',
});

const createSession = (title = 'New session') => request({
  url: '/api/v1/chat/sessions',
  method: 'POST',
  data: { title },
});

const listMessages = (sessionId) => request({
  url: `/api/v1/chat/sessions/${sessionId}/messages`,
  method: 'GET',
});

const sendMessage = (sessionId, content, documentId = null) => request({
  url: `/api/v1/chat/sessions/${sessionId}/messages`,
  method: 'POST',
  data: {
    content,
    document_id: documentId,
  },
});

module.exports = {
  listSessions,
  createSession,
  listMessages,
  sendMessage,
};
