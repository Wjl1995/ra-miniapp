# ra-miniapp

WeChat mini program frontend for ReActAgent.

## Structure

- `pages/index` home
- `pages/chat` chat
- `pages/knowledge` knowledge base
- `pages/knowledge-detail` document detail
- `pages/me` profile

## Current Status

This repository now contains a mini program scaffold wired to the backend API contract.

- `utils/request.js` centralizes authenticated requests
- `utils/auth.js` handles login bootstrap
- `services/` wraps backend API calls
- `pages/` contain minimal page-level data flow

Before real-device use, update `config/env.js` to your backend host and set your own mini program AppID in local DevTools config such as `project.private.config.json` or your local copy of `project.config.json`.

## Reusable Smoke Tests

This repo includes two Node-based miniapp test helpers under `scripts/`:

- `simulate-services.js`: tests `utils/auth.js` and `services/*.js` against a live backend
- `simulate-miniapp.js`: tests page-level flows for `index`, `knowledge`, `knowledge-detail`, `chat`, and `me`

They do not require a published mini program. They simulate a minimal `wx` runtime and are useful for local or server-backed regression checks.

### Typical setup

If your backend is reachable from this machine:

```bash
set MINIAPP_API_BASE_URL=http://127.0.0.1:8000
node scripts/simulate-services.js
node scripts/simulate-miniapp.js
```

If your backend is deployed remotely and you want a stable local tunnel first:

```bash
ssh -i C:\Users\Administrator\.ssh\id_rsa -N -L 18080:127.0.0.1:80 root@8.138.137.124
```

Then in another terminal:

```bash
set MINIAPP_API_BASE_URL=http://127.0.0.1:18080
node scripts/simulate-services.js
node scripts/simulate-miniapp.js
```

### Optional environment variables

- `MINIAPP_API_BASE_URL`: backend base URL used by the test runtime
- `MINIAPP_LOGIN_CODE`: fake login code returned by simulated `wx.login`
- `MINIAPP_TEST_QUESTION`: question sent to the chat page/service test
- `MINIAPP_TEST_SEARCH_QUERY`: search query used by the service-level smoke test
- `MINIAPP_TEST_VERBOSE=1`: print lower-level request failures
