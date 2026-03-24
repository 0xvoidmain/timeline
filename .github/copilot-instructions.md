# Project Guidelines — Timeline

A world event timeline app where users browse, filter, and add events by category and country. Events support public, private, and anonymous visibility. Data can come from Wikipedia/media.

**Stack:** Vite + React + Tailwind CSS (frontend) · Bun (backend/runtime) · MongoDB + Mongoose (database) · OAuth via Google (auth)

## Build and Test

```sh
bun install            # install dependencies
bun run dev            # start both frontend + backend
bun run dev:frontend   # Vite dev server only (port 5173)
bun run dev:backend    # Bun API server only (port 3000)
bun run build          # production build
bun test               # run all tests (bun test runner)
```

## Architecture

```
src/                    # React frontend (Vite)
  ├── components/       #   Reusable UI components
  ├── pages/            #   Route-level page components
  ├── services/         #   API client layer (all backend calls)
  ├── hooks/            #   Custom React hooks
  ├── types/            #   Shared TypeScript interfaces
  ├── context/          #   React context providers (auth, etc.)
  └── lib/              #   Utility functions
server/                 # Bun backend
  ├── config/           #   DB connection, OAuth config
  ├── models/           #   Mongoose schemas (User, Event)
  ├── routes/           #   API route handlers
  ├── services/         #   Business logic, external API integrations
  ├── middleware/        #   Auth middleware, error handling
  └── lib/              #   JWT utilities, helpers
```

- **Frontend ↔ Backend**: All API calls go through `src/services/api.ts` — never call `fetch` directly in components
- **Vite proxy**: In dev, `/api/*` proxies to the Bun server (port 3000)
- **Entry points**: Frontend → `src/main.tsx` · Backend → `server/index.ts`

## Code Style

- TypeScript throughout (strict mode)
- Prefer functional components and hooks; avoid class components
- Use named exports over default exports
- Co-locate component tests (`*.test.tsx`) next to the component file

## Conventions

- **Package manager**: Bun — never use `npm` or `yarn` commands
- **Styling**: Tailwind CSS utility classes — avoid custom CSS unless absolutely necessary
- **Environment variables**: Use `.env` files; never hard-code secrets. Reference `.env.example` for required vars
- **Dates**: Store all dates as UTC in MongoDB. Format at render time only
- **Auth**: OAuth (Google) → JWT in httpOnly cookie — no localStorage tokens
- **Validation**: Use Zod schemas at API boundaries (server/routes)
- **API design**: RESTful JSON APIs under `/api/*`, always return `{ error: string }` on failure
- **Feature tracking**: After implementing or modifying a feature, update `FEATURES.md` at the project root

## Database

- Use Mongoose for all MongoDB operations
- Define schemas in `server/models/` with proper indexes
- Always validate input with Zod before writing to the database
- Use `populate()` for references but keep it minimal (select only needed fields)

## Security

- All write endpoints require authentication (JWT from httpOnly cookie)
- Validate and sanitize all user input at API boundaries
- Never expose internal error details to clients
- OAuth state parameters must be validated on callback
