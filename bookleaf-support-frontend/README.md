# BookLeaf Support Frontend

A Next.js 16 dashboard for the BookLeaf author-support portal. Authors raise tickets, admins work them, and the UI shows AI classifications and reply drafts as soon as the backend produces them.

Pairs with [`bookleaf-support-backend`](../bookleaf-support-backend). Every API call, enum, and Socket.IO event is typed against the backend's contracts.

**Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict), TailwindCSS + shadcn/ui, TanStack Query, Zustand, Socket.IO Client, React Hook Form + Zod, Axios.

---

## Run it locally

You need Node 18+, pnpm, and the backend running (default `http://localhost:8080`).

```bash
pnpm install
cp .env.example .env.local       # point to your backend
pnpm dev                         # http://localhost:3000
```

`.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:8080
```

Sign in with one of the seeded backend accounts:

| Role   | Email                | Password   |
| ------ | -------------------- | ---------- |
| ADMIN  | admin@bookleaf.com   | Admin@123  |
| AUTHOR | author1@bookleaf.com | Author@123 |
| AUTHOR | author2@bookleaf.com | Author@123 |

---

## Architecture

Feature-folder layout. UI, hooks, schemas, and types for a feature live together, so a new contributor can change "create ticket" without touching unrelated files.

```
src/
├── app/                 Next.js App Router (pages + route groups only)
│   ├── (admin)/...      role-guarded admin pages
│   ├── (author)/...     role-guarded author pages
│   └── login/
├── features/            auth / books / tickets / admin
├── components/          ui (shadcn), common, layout
├── services/api/        typed API clients (one per backend group)
├── sockets/             socket client + query-cache bridge
├── store/               zustand (auth, socket, ui)
├── providers/           Query + Auth + Toast composed root
├── lib/, types/, constants/, config/
```

Three rules:

1. **All HTTP goes through `services/api/*`.** Components never call Axios directly.
2. **Server state in TanStack Query, client state in Zustand.** Query owns lists / details / mutations. Zustand owns auth, socket status, and a tiny bit of UI.
3. **Forms use React Hook Form + Zod**, with schemas that mirror the backend's validators.

**Why:** features are self-contained, the wire contract lives in `types/`, `constants/`, and `services/api/*` (so a backend change is a one-place edit), and each state tool does one job.

### Auth & route protection

1. Login pushes `{ token, user }` into a persisted Zustand store.
2. The Axios interceptor stamps `Authorization: Bearer <token>` on every request.
3. `AuthProvider` runs `GET /auth/me` in the background — if the JWT is dead, the response interceptor clears the store and the route guard sends the user to `/login`.
4. Route groups gate by role: `(author)` is wrapped in `<RouteGuard role="AUTHOR">`, `(admin)` in `<RouteGuard role="ADMIN">`. The guard waits for auth to hydrate before deciding, so it doesn't bounce real users on first render.

### Real-time

One Socket.IO connection per session. Three events get bridged into the TanStack Query cache so the UI updates without polling:

- `ticket:created` → invalidate the relevant list
- `ticket:updated` → patch the cached detail + invalidate the list
- `message:new` → append to the cached thread (or invalidate)

### AI in the UI

The UI follows the same rule as the backend: AI is assistive, not authoritative.

- **`AiClassificationCard`** shows the AI source (`AI` / `FALLBACK` / pending) and confidence. It never pretends AI ran when the fallback fired.
- **Admin overrides** hit the backend's PATCH endpoints; the activity log captures `aiOverridden` so the audit trail reflects the human call.
- **`AiDraftPanel`** has an explicit "Generate draft" button — never auto-fires. The draft drops into an editable textarea so the admin reviews and edits before sending. A 503 from the backend renders a friendly message, not a stack trace.

---

## Environment

| Variable                 | Required | Notes                     |
| ------------------------ | -------- | ------------------------- |
| `NEXT_PUBLIC_API_URL`    | **yes**  | full URL including `/api` |
| `NEXT_PUBLIC_SOCKET_URL` | **yes**  | root URL (no `/api`)      |

`src/config/env.ts` throws when the module loads if a required var is missing — broken deploys fail immediately.

---

## Known limitations & what I'd improve with more time

- **No SSR data fetching.** Auth lives in localStorage, so the App Router is doing routing + bundling only. Every data hook is `"use client"`.
- **No optimistic admin overrides.** The PATCH response is the source of truth. Optimistic updates with rollback are an easy follow-up.
- **No file uploads.** Out of scope; pre-signed S3 PUTs would be the next step.
- **No tests yet.** Vitest + React Testing Library for components, Playwright for the login / create-ticket / admin-respond flows.
- **No dark mode toggle.** Tailwind config and CSS tokens are ready; it's a single component.
- **No accessibility audit pass.** Radix primitives are accessible out of the box, but I haven't run axe or a screen-reader sweep end-to-end.
- **No offline / poor-network UX.** Mutations don't queue or retry on a flaky connection.
