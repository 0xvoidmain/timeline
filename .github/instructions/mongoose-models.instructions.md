---
description: "Use when creating or editing Mongoose model schemas in server/models/. Covers schema design, indexes, types, and best practices."
applyTo: "server/models/**/*.ts"
---

# Mongoose Model Guidelines

## Schema Definition

- Use `new Schema({...})` with explicit field types
- Export both the type and model: `export type IUser = ...` and `export const User = ...`
- Use `InferSchemaType<typeof schema>` for type inference

## Field Conventions

- `required: true` for mandatory fields
- Always set `default` values where sensible
- Use `enum` for constrained string fields (e.g., visibility, provider)
- Use `{ timestamps: true }` option for auto `createdAt`/`updatedAt`

## Indexes

- Add indexes for fields used in queries: `{ index: true }`
- Compound indexes for common filter combos: `schema.index({ category: 1, country: 1 })`
- Unique indexes for identity fields: `{ unique: true }`

## References

- Use `Schema.Types.ObjectId` with `ref: "ModelName"` for relations
- Keep `populate()` selective — only select needed fields

## Naming

- Model name: singular PascalCase (`User`, `Event`)
- Schema variable: `camelCaseSchema` (e.g., `eventSchema`)
- Type: `IModelName` (e.g., `IEvent`)
