import type { z } from "zod/v4";
import type {
  createEventSchema,
  listQuerySchema,
  createCommentSchema,
  createReactionSchema,
  createCategorySchema,
  updateCategorySchema,
  approveEventSchema,
  createReactionTypeSchema,
  updateReactionTypeSchema,
} from "./schemas.ts";
import type {
  Visibility,
  EventStatus,
  EventType,
  UserRole,
  ReactionTarget,
} from "./constants.ts";

// ── User (API response shape) ──

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: UserRole;
}

// ── Shared sub-types ──

export interface EventSource {
  title?: string;
  content?: string;
  url: string;
}

export interface EventMetadata {
  label: string;
  info: string;
  group?: string;
}

export interface EventPeriod {
  startYear: number;
  endYear: number;
  description?: string;
}

export interface EventContributor {
  user: { _id: string; name: string; avatar: string };
  role: string;
  addedAt: string;
}

export interface ReactionCount {
  type: string;
  count: number;
}

// ── Event (API response shape — after JSON serialization) ──

export interface TimelineEvent {
  _id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  endDate?: string;
  image?: string;
  category: string;
  country: string;
  eventType: EventType;
  status: EventStatus;
  visibility: Visibility;
  createdBy: { _id: string; name: string; avatar: string };
  approvedBy?: { _id: string; name: string; avatar: string };
  approvedAt?: string;
  reviewNote?: string;
  contributors: EventContributor[];
  sources: EventSource[];
  metadata: EventMetadata[];
  period?: EventPeriod;
  baseScore: number;
  engagementScore: number;
  score: number;
  reactionCounts: ReactionCount[];
  commentCount: number;
  viewCount: number;
  currentVersion: number;
  media: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ── Category (API response shape) ──

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  eventCount: number;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Year stat (API response shape) ──

export interface YearStat {
  _id: string;
  year: number;
  eventCount: number;
}

// ── Comment (API response shape) ──

export interface Comment {
  _id: string;
  eventId: string;
  author: { _id: string; name: string; avatar: string };
  text: string;
  parentId?: string;
  depth: number;
  reactionCounts: ReactionCount[];
  isEdited: boolean;
  editedAt?: string;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
}

// ── Reaction (API response shape) ──

export interface Reaction {
  _id: string;
  targetType: ReactionTarget;
  targetId: string;
  userId: string;
  type: string;
  createdAt: string;
}

// ── Reaction type (API response shape) ──

export interface ReactionTypeConfig {
  _id: string;
  name: string;
  icon: string;
  label: string;
  color: string;
  order: number;
  isActive: boolean;
}

// ── Event version (API response shape) ──

export interface EventVersion {
  _id: string;
  eventId: string;
  version: number;
  snapshot: Record<string, unknown>;
  editedBy: { _id: string; name: string; avatar: string };
  editNote?: string;
  createdAt: string;
}

// ── Inferred input types from Zod schemas ──

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = Partial<CreateEventInput>;
export type EventFilters = z.infer<typeof listQuerySchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type CreateReactionInput = z.infer<typeof createReactionSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type ApproveEventInput = z.infer<typeof approveEventSchema>;
export type CreateReactionTypeInput = z.infer<typeof createReactionTypeSchema>;
export type UpdateReactionTypeInput = z.infer<typeof updateReactionTypeSchema>;

// ── Pagination ──

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ── Paginated comments ──

export interface PaginatedComments {
  comments: Comment[];
  total: number;
  page: number;
  limit: number;
}
