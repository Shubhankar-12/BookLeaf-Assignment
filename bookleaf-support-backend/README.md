# BookLeaf Support Backend

A Node.js + TypeScript backend for a small author-support portal. Authors raise tickets, admins work them, and Google Gemini helps with sorting, priority, and reply drafts. The AI assists the admin — it never blocks them. If Gemini is down or the key is missing, tickets still get created and the queue still works.

**Stack:** Node 18+, Express, TypeScript (strict), MongoDB (Mongoose), Socket.IO, Google Gemini, JWT.

---

## Run it locally

You need Node 18+, pnpm, and Mongo running (local or Atlas).

```bash
pnpm install
cp .env.example .env          # set MONGO_URI and JWT_SECRET; GEMINI_API_KEY is optional
pnpm seed                     # 1 admin + 2 authors + a few books (safe to re-run)
pnpm dev                      # nodemon on src/
```

Once it's up:

- `http://localhost:8080/healthz` — liveness + Mongo status
- `http://localhost:8080/api-docs` — Swagger UI (full API contract)

### Seed accounts

| Role   | Email                  | Password   |
| ------ | ---------------------- | ---------- |
| ADMIN  | admin@bookleaf.com     | Admin@123  |
| AUTHOR | priya.sharma@email.com | Author@123 |

Leave `GEMINI_API_KEY` empty to run in fallback mode (no AI calls, safe defaults).

---

## Architecture

Clean / use-case-driven. Every endpoint is a folder under `src/use_cases/...` with the same seven files: `controller`, `validator`, `request`, `dto`, `usecase`, `index`, `doc`.

Three rules:

1. **Controllers never touch Mongoose.** DB calls go through `src/db/queries/*`.
2. **Use cases never import Express.** They take a DTO and return either a result or `{ error, status? }`.
3. **AI lives only in `src/services/ai/*`.** Not in controllers, not in routes.

**Why:** features are self-contained (easy to find and change), use cases are framework-agnostic (easy to test), and the wire contract (queries, enums, socket events) lives in a small handful of files — so most changes are one-place edits.

```
src/
  app.ts, server.ts
  routes/          one router per group, mounted under /api
  use_cases/       auth/, book/, ticket/, admin/
  db/
    {user, author, book, ticket, message, activity, ai_job}/
    queries/       the only files that talk to Mongoose
  services/
    socket.service.ts
    ai/            gemini, prompt-builder, kb, ticket-ai (+ orchestrator)
  sockets/         auth, room model, typed events
  constants/       ticket enums + knowledge-base chunks
  helpers/         Auth / Role / Error / RequestId / RateLimit middlewares
  utils/, validations/, types/, config/
```

---

## API

Everything is under `/api`. Full contract at `http://localhost:8080/api-docs`.

| Method | Path                                                       | Who                   | What                                                     |
| ------ | ---------------------------------------------------------- | --------------------- | -------------------------------------------------------- |
| POST   | `/api/auth/login`                                          | anyone (rate-limited) | email + password → JWT                                   |
| GET    | `/api/auth/me`                                             | JWT                   | current user                                             |
| GET    | `/api/books`, `/api/books/:id`                             | AUTHOR/ADMIN          | author sees own; admin sees all                          |
| POST   | `/api/tickets`                                             | AUTHOR/ADMIN          | creates a ticket; AI runs in the background              |
| GET    | `/api/tickets`, `/api/tickets/:id`                         | AUTHOR/ADMIN          | author sees own; admin sees all (internal notes hidden)  |
| POST   | `/api/tickets/:id/messages`                                | AUTHOR/ADMIN          | reply on a thread                                        |
| GET    | `/api/admin/tickets`, `/api/admin/tickets/:id`             | ADMIN                 | full queue + ticket detail + activity log                |
| PATCH  | `/api/admin/tickets/:id/{status,category,priority,assign}` | ADMIN                 | override fields (tagged `aiOverridden` if AI had set it) |
| POST   | `/api/admin/tickets/:id/respond`                           | ADMIN                 | public reply                                             |
| POST   | `/api/admin/tickets/:id/internal-note`                     | ADMIN                 | admins-only note                                         |
| POST   | `/api/admin/tickets/:id/ai-draft`                          | ADMIN                 | generate a reply draft (not saved)                       |

Response shape:

```json
{ "success": true,  "message": "...", "data": { ... } }
{ "success": false, "error":   "...", "details": [ ... ] }
```

---

## How the AI works

**Two entry points:**

- **Ticket create** — fires in the background. The HTTP response returns immediately with `category: null, priority: null`. When AI lands, the server emits `ticket:updated` over Socket.IO and the UI refreshes.
- **Admin AI draft** — the admin clicks "Generate draft", gets a reply suggestion, edits it, and sends it via the normal respond endpoint. Drafts aren't saved.

**Prompt strategy** — pure functions in `src/services/ai/prompt-builder.service.ts`:

- _Classify_ — lists the six categories, asks for JSON `{ category, confidence }`. Max 100 tokens.
- _Priority_ — embeds BookLeaf's priority policy in plain words. Same JSON shape, 100 tokens.
- _Draft_ — sets tone (under 200 words, acknowledge first, no "as an AI" phrases) and injects 2 topic chunks + 1 tone chunk from the knowledge base. Max 500 tokens.

The KB lives in `src/constants/knowledge-base/`. `kb.service.chooseChunks` scores each chunk by keyword overlap and sends only the top 2 — the full KB is never sent.

**Error handling** — AI methods never throw. Any failure (no key, network, bad JSON, unknown enum) becomes `{ source: "FALLBACK" }` with a safe default (`"General Inquiry"`, `"MEDIUM"`, or a 503 on draft). Mixed results count as fallback. Top-level `category` and `priority` are only set when source is AI — so admin filters can tell "AI said HIGH" from "we defaulted". Every call is recorded in `ai_jobs` with model, tokens, and latency.

**Cost management** — `gemini-2.5-flash` by default, max tokens capped per call, 2–3 KB chunks (not the full KB), Gemini "thinking" turned off, drafts on-demand only, and background AI is fire-and-forget so it runs once per ticket on create, not on every read.

---

## Environment

`src/config/env.ts` validates everything with zod and refuses to boot on bad config.

| Var              | Required | Default                 |
| ---------------- | -------- | ----------------------- |
| `MONGO_URI`      | **yes**  | —                       |
| `JWT_SECRET`     | **yes**  | —                       |
| `JWT_EXPIRES_IN` | no       | `7d`                    |
| `CORS_ORIGIN`    | no       | `http://localhost:3000` |
| `GEMINI_API_KEY` | no       | — (empty → fallback)    |
| `GEMINI_MODEL`   | no       | `gemini-2.5-flash`      |
| `PORT`           | no       | `8080`                  |
| `LOG_LEVEL`      | no       | `info`                  |

---

## Known limitations & what I'd improve with more time

- **No automated tests yet.** Vitest + Supertest over the use cases would be quick wins.
- **AI runs in-process.** For real traffic, move it to BullMQ or SQS — same `ticket-ai.service`, invoked from a worker.
- **JWT has no revocation list.** Short-lived access + refresh tokens is the production upgrade.
- **No file attachments.** Pre-signed S3 PUT pattern when needed.
- **No caching.** A short Redis cache on admin lists is the first easy win if admin dashboards get heavy.
- **Single Socket.IO instance.** `@socket.io/redis-adapter` covers horizontal scaling later.
