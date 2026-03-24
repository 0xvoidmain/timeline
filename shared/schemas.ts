import { z } from "zod/v4";
import { VISIBILITY } from "./constants.ts";

// ── Event schemas ──

export const createEventSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  date: z.iso.datetime(),
  endDate: z.iso.datetime().optional(),
  category: z.string().min(1).max(100),
  country: z.string().min(1).max(100),
  source: z.string().max(200).optional(),
  sourceUrl: z.url().optional(),
  visibility: z.enum(VISIBILITY).default("public"),
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
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
