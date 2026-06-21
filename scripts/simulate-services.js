const path = require('path');
const { installServiceRuntime } = require('./miniapp-test-lib');

async function main() {
  const apiBaseUrl = process.env.MINIAPP_API_BASE_URL || 'http://127.0.0.1:18080';
  const loginCode = process.env.MINIAPP_LOGIN_CODE || 'codex-miniapp-service-login';
  installServiceRuntime({ apiBaseUrl, loginCode, verbose: process.env.MINIAPP_TEST_VERBOSE === '1' });

  const { login } = require(path.resolve(__dirname, '../utils/auth.js'));
  const { listSuggestions, searchDocuments } = require(path.resolve(__dirname, '../services/search.js'));
  const { listDocuments, getDocument } = require(path.resolve(__dirname, '../services/document.js'));
  const { createSession, sendMessage, listMessages } = require(path.resolve(__dirname, '../services/chat.js'));

  const loginResult = await login();
  const suggestions = await listSuggestions();
  const documents = await listDocuments();
  const firstDocument = documents[0] || null;
  const documentDetail = firstDocument ? await getDocument(firstDocument.id) : null;
  const searchQuery = process.env.MINIAPP_TEST_SEARCH_QUERY || 'support email';
  const chatQuestion = process.env.MINIAPP_TEST_QUESTION || 'What is the support email?';
  const searchResults = await searchDocuments(searchQuery, 3, firstDocument ? firstDocument.domain : '');
  const session = await createSession('Miniapp services smoke test');
  const answer = await sendMessage(
    session.id,
    chatQuestion,
    firstDocument ? firstDocument.id : null,
  );
  const messages = await listMessages(session.id);

  console.log(
    JSON.stringify(
      {
        apiBaseUrl,
        loginResult,
        suggestions,
        documents,
        documentDetail,
        searchResults,
        answer,
        messages,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(JSON.stringify(error, null, 2));
  process.exitCode = 1;
});
