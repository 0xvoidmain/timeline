import { z } from "zod/v4";
import {
  VISIBILITY,
  EVENT_STATUS,
  EVENT_TYPE,
  REACTION_TARGET,
} from "./constants.ts";

// ── Reusable sub-schemas ──

export const eventSourceSchema = z.object({
  title: z.string().max(200).optional(),
  content: z.string().max(2000).optional(),
  url: z.url(),
});

export const eventMetadataSchema = z.object({
  label: z.string().min(1).max(100),
  info: z.string().min(1).max(500),
  group: z.string().max(100).optional(),
});

export const eventPeriodSchema = z.object({
  startYear: z.number().int(),
  endYear: z.number().int(),
  description: z.string().max(500).optional(),
});

// ── Event schemas ──

export const createEventSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(5000),
  date: z.iso.datetime(),
  endDate: z.iso.datetime().optional(),
  image: z.url().optional(),
  category: z.string().min(1).max(100),
  country: z.string().min(1).max(100),
  eventType: z.enum(EVENT_TYPE).default("event"),
  visibility: z.enum(VISIBILITY).default("public"),
  sources: z.array(eventSourceSchema).max(20).optional(),
  metadata: z.array(eventMetadataSchema).max(50).optional(),
  period: eventPeriodSchema.optional(),
  baseScore: z.number().min(0).default(0),
  media: z.array(z.url()).max(10).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
});

export const updateEventSchema = createEventSchema.partial();

export const listQuerySchema = z.object({
  category: z.string().optional(),
  country: z.string().optional(),
  from: z.iso.datetime().optional(),
  to: z.iso.datetime().optional(),
  visibility: z.enum(VISIBILITY).optional(),
  eventType: z.enum(EVENT_TYPE).optional(),
  status: z.enum(EVENT_STATUS).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ── Approval schema ──

export const approveEventSchema = z.object({
  status: z.enum(["verified", "rejected"] as const),
  reviewNote: z.string().max(1000).optional(),
});

// ── Comment schemas ──

export const createCommentSchema = z.object({
  text: z.string().min(1).max(2000),
  parentId: z.string().optional(),
});

// ── Reaction schemas ──

export const createReactionSchema = z.object({
  targetType: z.enum(REACTION_TARGET),
  targetId: z.string().min(1),
  type: z.string().min(1).max(50),
});

// ── Category schemas ──

export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  icon: z.string().max(100).optional(),
  color: z.string().max(50).optional(),
  order: z.number().int().min(0).optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

// ── Reaction type schemas ──

export const createReactionTypeSchema = z.object({
  name: z.string().min(1).max(50),
  icon: z.string().min(1).max(100),
  label: z.string().min(1).max(100),
  color: z.string().max(50).optional(),
  order: z.number().int().min(0).optional(),
});

export const updateReactionTypeSchema = createReactionTypeSchema.partial();
