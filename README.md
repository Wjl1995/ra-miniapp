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

Before real-device use, update `config/env.js` to your backend host and import the project into WeChat DevTools.
