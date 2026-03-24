---
description: "Use when creating or editing API route handlers in server/routes/. Covers REST conventions, Zod validation, error handling, and auth patterns."
applyTo: "server/routes/**/*.ts"
---

# API Route Guidelines

## Structure

- Each route file exports a `routes` object mapping URL patterns to handlers
- Use Bun's built-in `routes` property in `Bun.serve()` — no manual path matching
- Routes are spread into the `routes` object in `server/index.ts`
- Use per-HTTP method handlers: `{ GET: ..., POST: ... }` for routes with multiple methods
- Use `req.params` (from `BunRequest`) for route parameters like `:id`

```ts
// Example route file export:
export const fooRoutes = {
  "/api/foo": {
    GET: async (req: Request) => {
      /* ... */
    },
    POST: requireAuth(async (req, userId) => {
      /* ... */
    }),
  },
  "/api/foo/:id": {
    GET: async (req: BunRequest<"/api/foo/:id">) => {
      /* ... */
    },
  },
} as const;
```

## Validation

- Import Zod schemas from `shared/schemas.ts` — do not redefine them in route files
- Use `.safeParse()` and return 400 with `error.issues` on failure
- Validate URL params (e.g., ObjectId format) before database queries

## Auth

- Use `requireAuth(handler)` wrapper from `server/middleware/auth.ts` for protected routes
- The wrapper provides `(req, userId)` to the inner handler
- Check ownership before update/delete: `event.createdBy.toString() !== userId`

## Error Responses

- Always return `{ error: string }` with appropriate HTTP status
- 400 — validation errors
- 401 — not authenticated
- 403 — not authorized (wrong owner)
- 404 — resource not found
- 500 — unexpected errors (log internally, return generic message)

## Patterns

```ts
// Import schemas from shared — never define inline:
import { createFooSchema } from "../../shared/schemas.ts";

// Parse → validate → act → respond
const parsed = createFooSchema.safeParse(body);
if (!parsed.success) {
  return Response.json(
    { error: "Validation failed", details: parsed.error.issues },
    { status: 400 },
  );
}
```
