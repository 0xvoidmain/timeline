import type { z } from "zod/v4";
import type { createEventSchema, listQuerySchema } from "./schemas.ts";
import type { Visibility } from "./constants.ts";

// ── User (API response shape) ──

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
}

// ── Event (API response shape — after JSON serialization) ──

export interface TimelineEvent {
  _id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  category: string;
  country: string;
  source?: string;
  sourceUrl?: string;
  visibility: Visibility;
  createdBy: { _id: string; name: string; avatar: string };
  media: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ── Inferred input types from Zod schemas ──

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = Partial<CreateEventInput>;
export type EventFilters = z.infer<typeof listQuerySchema>;

// ── Pagination ──

export interface PaginatedResponse<T> {
  events: T[];
  total: number;
  page: number;
  limit: number;
}
