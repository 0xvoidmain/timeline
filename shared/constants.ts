export const VISIBILITY = ["public", "private", "anonymous"] as const;
export type Visibility = (typeof VISIBILITY)[number];

export const AUTH_PROVIDERS = ["google"] as const;
export type AuthProvider = (typeof AUTH_PROVIDERS)[number];

export const EVENT_STATUS = [
  "draft",
  "pending",
  "verified",
  "rejected",
] as const;
export type EventStatus = (typeof EVENT_STATUS)[number];

export const EVENT_TYPE = ["event", "anniversary"] as const;
export type EventType = (typeof EVENT_TYPE)[number];

export const USER_ROLE = ["user", "moderator", "admin"] as const;
export type UserRole = (typeof USER_ROLE)[number];

export const REACTION_TARGET = ["event", "comment"] as const;
export type ReactionTarget = (typeof REACTION_TARGET)[number];

export const DEFAULT_REACTION_TYPES = [
  "like",
  "love",
  "sad",
  "wow",
  "angry",
] as const;
