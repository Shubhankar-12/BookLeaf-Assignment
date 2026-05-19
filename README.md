# BookLeaf Support

An author-support portal for BookLeaf. Authors raise tickets, admins work them, and Google Gemini assists with categorization, priority, and reply drafts — assistive, never blocking.

This repo is a monorepo of two independent apps:

- **[`bookleaf-support-backend`](https://github.com/Shubhankar-12/BookLeaf-Assignment/blob/main/bookleaf-support-backend)** — Node.js + Express + TypeScript API, MongoDB, Socket.IO, Gemini. Setup, API contract, AI behavior, and env vars are documented in its README.
- **[`bookleaf-support-frontend`](https://github.com/Shubhankar-12/BookLeaf-Assignment/blob/main/bookleaf-support-frontend)** — Next.js 16 + React 19 dashboard, TanStack Query, Zustand, Socket.IO client. Setup, architecture, and env vars are documented in its README.

## Quick start

Run the backend first, then the frontend.

1. **Backend** → follow [`bookleaf-support-backend`](https://github.com/Shubhankar-12/BookLeaf-Assignment/blob/main/bookleaf-support-backend/README.md) → serves on `http://localhost:8080`
2. **Frontend** → follow [`bookleaf-support-frontend`](https://github.com/Shubhankar-12/BookLeaf-Assignment/blob/main/bookleaf-support-frontend/README.md) → serves on `http://localhost:3000`

Seed credentials (created by `pnpm seed` in the backend):

| Role   | Email                  | Password   |
| ------ | ---------------------- | ---------- |
| ADMIN  | admin@bookleaf.com     | Admin@123  |
| AUTHOR | priya.sharma@email.com | Author@123 |

> **Note:** The UI is not responsive, so it's best to use a desktop browser.
