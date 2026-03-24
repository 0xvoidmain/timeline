---
description: "Use when writing or editing tests. Covers test patterns using bun test runner, mocking strategies, and assertion conventions."
applyTo: "**/*.test.*"
---

# Testing Guidelines

## Framework

- Use `bun test` (built-in test runner, Jest-compatible API)
- Test files: `*.test.ts` or `*.test.tsx` co-located next to source files

## Structure

```ts
import { describe, it, expect, beforeEach } from "bun:test";

describe("ModuleName", () => {
  beforeEach(() => {
    /* setup */
  });

  it("should do the expected thing", () => {
    expect(result).toBe(expected);
  });
});
```

## Conventions

- Describe blocks: match module/component name
- Test names: start with "should" — describe behavior, not implementation
- One assertion focus per test (multiple `expect` is ok if testing same behavior)
- Test edge cases: empty inputs, boundary values, error paths

## Mocking

- Mock external dependencies (API calls, database) — not internal logic
- Use `mock()` from `bun:test` for function mocks
- For API tests: test the route handler directly with constructed `Request` objects

## Frontend Components

- Test behavior, not implementation details
- Prefer testing what the user sees/interacts with
- Mock API calls via the `src/services/api.ts` module
