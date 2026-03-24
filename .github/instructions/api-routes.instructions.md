---
description: "Use when creating or editing API route handlers in server/routes/. Covers REST conventions, Zod validation, error handling, and auth patterns."
applyTo: "server/routes/**/*.ts"
---

# API Route Guidelines

## Structure

- Each route file exports a handler function: `handleXxxRoutes(req, path)`
- Handler returns `Response | null` — return `null` for unmatched routes
- Routes are registered in `server/index.ts`

## Validation

- Always validate request bodies with Zod schemas defined at the top of the file
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
// Always use this pattern for CRUD routes:
const schema = z.object({
  /* ... */
});

// Parse → validate → act → respond
const parsed = schema.safeParse(body);
if (!parsed.success) {
  return Response.json(
    { error: "Validation failed", details: parsed.error.issues },
    { status: 400 },
  );
}
```
