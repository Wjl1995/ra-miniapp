const path = require('path');

function installEnvOverride(apiBaseUrl) {
  const envModulePath = path.resolve(__dirname, '../config/env.js');
  require.cache[envModulePath] = {
    id: envModulePath,
    filename: envModulePath,
    loaded: true,
    exports: {
      API_BASE_URL: apiBaseUrl,
      APP_NAME: 'RA MiniApp',
      DAILY_QUOTA: 50,
    },
  };
}

function createStorage() {
  return new Map();
}

function createWxRuntime({ storage, loginCode = 'codex-miniapp-simulated-login', verbose = false }) {
  return {
    request(options) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 120000);
      const headers = { ...(options.header || {}) };
      const method = options.method || 'GET';
      const isMultipart =
        headers['Content-Type']?.includes('multipart/form-data') ||
        headers['content-type']?.includes('multipart/form-data');
      if (!isMultipart && options.data && !headers['Content-Type'] && !headers['content-type']) {
        headers['Content-Type'] = 'application/json';
      }
      fetch(options.url, {
        method,
        headers,
        body: options.data
          ? isMultipart || typeof options.data === 'string'
            ? options.data
            : JSON.stringify(options.data)
          : undefined,
        signal: controller.signal,
      })
        .then(async (response) => {
          clearTimeout(timer);
          let data;
          const text = await response.text();
          try {
            data = text ? JSON.parse(text) : null;
          } catch {
            data = text;
          }
          options.success &&
            options.success({
              statusCode: response.status,
              data,
            });
        })
        .catch((error) => {
          clearTimeout(timer);
          if (verbose) {
            console.error('wx.request failed', {
              url: options.url,
              method,
              headers,
              error: String(error),
            });
          }
          options.fail && options.fail(error);
        });
    },
    login({ success, fail }) {
      try {
        success({ code: loginCode });
      } catch (error) {
        fail && fail(error);
      }
    },
    getStorageSync(key) {
      return storage.has(key) ? storage.get(key) : '';
    },
    setStorageSync(key, value) {
      storage.set(key, value);
    },
    removeStorageSync(key) {
      storage.delete(key);
    },
    navigateTo({ url }) {
      storage.set('__lastNavigateTo', url);
    },
    switchTab({ url, success, fail }) {
      try {
        storage.set('__lastSwitchTab', url);
        success && success();
      } catch (error) {
        fail && fail(error);
      }
    },
  };
}

function installAppRuntime({ loginCode, verbose = false }) {
  const storage = createStorage();
  const pages = [];
  let currentApp = null;

  global.App = function App(config) {
    currentApp = {
      globalData: JSON.parse(JSON.stringify(config.globalData || {})),
      ...config,
    };
    return currentApp;
  };

  global.getApp = function getApp() {
    return currentApp;
  };

  global.Page = function Page(config) {
    pages.push(config);
    return config;
  };

  global.wx = createWxRuntime({ storage, loginCode, verbose });

  return {
    storage,
    pages,
    getCurrentApp() {
      return currentApp;
    },
  };
}

function installServiceRuntime({ apiBaseUrl, loginCode, verbose = false }) {
  const storage = createStorage();
  const app = {
    globalData: {
      token: '',
      user: null,
      pendingChatEntry: null,
    },
  };

  installEnvOverride(apiBaseUrl);
  global.getApp = () => app;
  global.wx = createWxRuntime({ storage, loginCode, verbose });

  return { storage, app };
}

function wrapPage(definition, route) {
  return {
    route,
    data: JSON.parse(JSON.stringify(definition.data || {})),
    ...definition,
    setData(update) {
      this.data = { ...this.data, ...update };
    },
  };
}

function loadPage(pages, relativePath) {
  pages.length = 0;
  require(path.resolve(__dirname, '..', relativePath));
  const definition = pages[pages.length - 1];
  return wrapPage(definition, relativePath);
}

module.exports = {
  installEnvOverride,
  installAppRuntime,
  installServiceRuntime,
  loadPage,
};
