const path = require('path');
const { installEnvOverride, installAppRuntime, loadPage } = require('./miniapp-test-lib');

async function main() {
  const apiBaseUrl = process.env.MINIAPP_API_BASE_URL || 'http://127.0.0.1:18080';
  const loginCode = process.env.MINIAPP_LOGIN_CODE || 'codex-miniapp-page-login';
  installEnvOverride(apiBaseUrl);
  const runtime = installAppRuntime({ loginCode, verbose: process.env.MINIAPP_TEST_VERBOSE === '1' });

  require(path.resolve(__dirname, '../app.js'));
  const app = runtime.getCurrentApp();
  if (app.onLaunch) {
    app.onLaunch();
  }

  const indexPage = loadPage(runtime.pages, 'pages/index/index.js');
  await indexPage.handleLogin();
  await indexPage.onShow();

  const knowledgePage = loadPage(runtime.pages, 'pages/knowledge/knowledge.js');
  await knowledgePage.onShow();
  const firstDocument = knowledgePage.data.documents[0];

  const detailPage = loadPage(runtime.pages, 'pages/knowledge-detail/knowledge-detail.js');
  await detailPage.onLoad({ id: firstDocument && firstDocument.id });

  const chatPage = loadPage(runtime.pages, 'pages/chat/chat.js');
  await chatPage.onLoad({
    question: encodeURIComponent(process.env.MINIAPP_TEST_QUESTION || 'What is the support email?'),
    documentId: String(firstDocument && firstDocument.id),
  });

  const mePage = loadPage(runtime.pages, 'pages/me/me.js');
  await mePage.onShow();

  console.log(
    JSON.stringify(
      {
        apiBaseUrl,
        loginUser: indexPage.data.user,
        suggestions: indexPage.data.suggestions,
        documentsCount: knowledgePage.data.documents.length,
        firstDocument: detailPage.data.document,
        chatMessages: chatPage.data.messages,
        profile: mePage.data.user,
        errors: {
          index: indexPage.data.error,
          knowledge: knowledgePage.data.error,
          detail: detailPage.data.error,
          chat: chatPage.data.error,
          me: mePage.data.error,
        },
        lastNavigation: runtime.storage.get('__lastNavigateTo') || '',
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
