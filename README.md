# TaskFlow

> Full-stack task management engine built with Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, and PostgreSQL via Prisma ORM.

**Live Application:** [taskflow-gamma-amber-80.vercel.app](https://taskflow-gamma-amber-80.vercel.app/)  
**Repository:** [github.com/Marodioss/taskflow](https://github.com/Marodioss/taskflow)

---

## Architecture Overview

TaskFlow demonstrates modern full-stack Next.js patterns, moving away from legacy client-side data fetching (`useEffect` + REST endpoints) in favor of Server Components, React 19 Suspense streaming, and Server Actions.

```
                    ┌─────────────────────────┐
                    │      Browser Client     │
                    │   (TaskManager.tsx)     │
                    └───────────┬─────────────┘
                                │
               ┌────────────────┴────────────────┐
               │                                 │
     Optimistic Updates                Server Actions (RPC)
       (0ms UI update)                (create / toggle / delete)
               │                                 │
               ▼                                 ▼
        Local State Sync             ┌───────────────────────┐
                                     │  Next.js Server / Vercel│
                                     │     (action.ts)       │
                                     └───────────┬───────────┘
                                                 │
                                           Prisma 6 Client
                                                 │
                                                 ▼
                                     ┌───────────────────────┐
                                     │   Neon PostgreSQL     │
                                     │ (AWS eu-central-1)    │
                                     └───────────────────────┘
```

---

## Key Engineering Decisions

### 1. Server Components & Suspense Streaming (`RSC`)
- Initial task data is queried directly in [page.tsx](src/app/page.tsx) on the server, eliminating client-side loading spinners and zero-data layout shifts.
- [loading.tsx](src/app/loading.tsx) provides instant fallback skeleton rendering via React `<Suspense>` while server database queries resolve.

### 2. Server Actions with Optimistic UI
- Task mutations (create, toggle status, delete) run via typed Server Actions in [action.ts](src/app/action.ts).
- Client state is updated optimistically at $0\text{ms}$ before network completion. If a mutation fails, changes roll back and display an alert to the user.
- Cache invalidation is handled server-side via `revalidatePath("/")`.

### 3. Resilient Error Handling
- [error.tsx](src/app/error.tsx) isolates unexpected runtime errors or database disconnects into a localized React Error Boundary with recovery (`reset()`), preventing white-screen crashes.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (Turbopack, App Router) |
| **Frontend** | React 19, TypeScript, Tailwind CSS v4 |
| **Database** | PostgreSQL (Neon Serverless, AWS Frankfurt) |
| **ORM** | Prisma 6 |
| **Deployment** | Vercel (Edge Network + Serverless Functions) |

---

## Local Development

```bash
# Clone the repository
git clone https://github.com/Marodioss/taskflow.git
cd taskflow

# Install dependencies
npm install

# Set up environment variables
# Copy .env.example to .env and add your DATABASE_URL

# Generate Prisma Client & Push DB Schema
npx prisma generate
npx prisma db push

# Start dev server
npm run dev
```
