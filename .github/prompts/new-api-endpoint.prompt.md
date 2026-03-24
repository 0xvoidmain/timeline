---
description: "Create a new REST API endpoint with Zod validation, auth middleware, and proper error handling."
agent: "agent"
---

Create a new API endpoint for the Timeline app:

## Steps

1. **Define Zod schema** for request validation at the top of the route file
2. **Create handler** in the appropriate `server/routes/*.ts` file:
   - Parse and validate input with `schema.safeParse()`
   - Use `requireAuth()` wrapper if the endpoint modifies data
   - Return proper HTTP status codes and `{ error: string }` on failure
3. **Register route** in `server/index.ts` if it's a new route file
4. **Add frontend API method** in `src/services/api.ts` with proper types
5. **Update types** in `src/types/index.ts` if new data shapes are introduced
6. **Update FEATURES.md** with the new endpoint details

Ask what the endpoint should do and what data it handles before starting.
