# BookLeaf Support

An author-support portal for BookLeaf. Authors raise tickets, admins work them, and Google Gemini assists with categorization, priority, and reply drafts , assistive, never blocking.

This repo is a monorepo of two independent apps:

- **[`bookleaf-support-backend`](https://github.com/Shubhankar-12/BookLeaf-Assignment/blob/main/bookleaf-support-backend)** , Node.js + Express + TypeScript API, MongoDB, Socket.IO, Gemini. Setup, API contract, AI behavior, and env vars are documented in its README.
- **[`bookleaf-support-frontend`](https://github.com/Shubhankar-12/BookLeaf-Assignment/blob/main/bookleaf-support-frontend)** , Next.js 16 + React 19 dashboard, TanStack Query, Zustand, Socket.IO client. Setup, architecture, and env vars are documented in its README.

## Run locally

You'll need **Node 18+**, **pnpm**, and **MongoDB** (local or Atlas).

Clone the repo:

```bash
git clone https://github.com/Shubhankar-12/BookLeaf-Assignment.git
cd BookLeaf-Assignment
```

### 1. Backend → `http://localhost:8080`

```bash
cd bookleaf-support-backend
pnpm install
cp .env.example .env       # set MONGO_URI and JWT_SECRET (GEMINI_API_KEY optional)
pnpm seed                  # seeds 1 admin + 2 authors + a few books (safe to re-run)
pnpm dev
```

Check `http://localhost:8080/healthz` for liveness and `http://localhost:8080/api-docs` for the full API contract.

### 2. Frontend → `http://localhost:3000`

In a new terminal:

```bash
cd bookleaf-support-frontend
pnpm install
cp .env.example .env.local   # defaults point at http://localhost:8080
pnpm dev
```

### 3. Sign in

| Role   | Email                  | Password   |
| ------ | ---------------------- | ---------- |
| ADMIN  | admin@bookleaf.com     | Admin@123  |
| AUTHOR | priya.sharma@email.com | Author@123 |

For deeper docs (architecture, API reference, env vars, AI behavior), see each app's README:
[backend](https://github.com/Shubhankar-12/BookLeaf-Assignment/blob/main/bookleaf-support-backend/README.md) · [frontend](https://github.com/Shubhankar-12/BookLeaf-Assignment/blob/main/bookleaf-support-frontend/README.md).

> **Note:** The UI is not responsive , use a desktop browser.

---

## Approach & Trade-offs

A quick note on how I built this, what I picked, and what I'd do next.

### What I aimed for

**AI that assists, never blocks.** Tickets get created instantly. Classification and priority run in the background and stream into the UI over Socket.IO. Draft replies are on-demand , admin clicks, reads, edits, sends. If Gemini fails or the key is missing, tickets fall back to safe defaults (`General Inquiry`, `MEDIUM`) and the UI is honest about it , the badge says `FALLBACK`, not "AI".

**Code that's easy to change.** One folder per endpoint on the backend (same seven files every time), one folder per feature on the frontend. The wire contract , enums, API clients, socket events , lives in a handful of files, so changing it is a one-place edit.

**Strict types and honest security.** TypeScript strict on both sides, no `any`. Authors only see their own data, "not yours" returns 404 (not 403, no existence leak). JWT verification re-fetches the user so deleted accounts can't slip through with a valid token. Internal notes are filtered twice , at the query and at the socket emission.

### Trade-offs

- **AI runs in-process.** Simpler infra, fine for this scale. For real traffic it belongs on a queue (BullMQ / SQS) with the same `ticket-ai.service` invoked from a worker.
- **JWT is stateless, no revocation.** Logout is a client-side token drop. Production wants short-lived access + refresh-token rotation.
- **No tests yet.** Use cases are pure and components are thin , both very test-friendly. I ran out of time.
- **No SSR.** Auth lives in localStorage, so every data hook is `"use client"`. Fine for an internal tool.
- **No optimistic UI on admin overrides, no file uploads, no caching layer, single Socket.IO instance.** All known, all have a clear next step (optimistic + rollback, pre-signed S3, short Redis cache, redis-adapter).

### What I'd do next

Tests first (Vitest + Supertest on the backend, RTL + Playwright on the frontend). Then AI on a queue with retries tracked in the existing `ai_jobs` collection. Then proper auth lifecycle, observability around AI cost and latency, and small UX polish , optimistic overrides, dark mode, an a11y pass.

The list is short because the foundation is in place: clear layering, strict typing on both sides, and an AI integration that fails gracefully.
