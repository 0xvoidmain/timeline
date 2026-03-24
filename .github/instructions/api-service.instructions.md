---
description: "Use when creating or editing frontend API service functions in src/services/. Covers API client patterns, error handling, and type safety."
applyTo: "src/services/**/*.ts"
---

# API Service Guidelines

## Structure

- All API calls are centralized in `src/services/api.ts`
- Use the `request<T>()` helper for type-safe fetch calls
- Group methods by domain: auth, events, etc.

## Conventions

- Always include `credentials: "include"` for cookie-based auth
- Set `Content-Type: application/json` for POST/PUT
- Return typed responses matching the server's JSON shape
- Use `encodeURIComponent()` for dynamic URL segments

## Error Handling

- The `request()` helper throws on non-ok responses
- Error message comes from the server's `{ error: string }` response body
- Components should catch errors and display user-friendly messages

## Adding New Endpoints

```ts
// Follow this pattern:
export const api = {
  // existing methods...
  newMethod: (params: InputType) =>
    request<ResponseType>("/path", {
      method: "POST",
      body: JSON.stringify(params),
    }),
};
```

## Rules

- Never use `fetch()` directly in components — always go through this service
- Keep response types in `src/types/index.ts`
- URL construction: use template literals with `encodeURIComponent` for IDs
