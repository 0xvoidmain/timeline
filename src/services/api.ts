import type {
  User,
  TimelineEvent,
  EventFilters,
  PaginatedResponse,
  CreateEventInput,
  ApproveEventInput,
  EventVersion,
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
  YearStat,
  Comment,
  CreateCommentInput,
  CreateReactionInput,
  ReactionTypeConfig,
  CreateReactionTypeInput,
  UpdateReactionTypeInput,
  Reaction,
  PaginatedComments,
} from "../types";

const BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { error?: string }).error || `Request failed: ${res.status}`,
    );
  }
  return res.json() as Promise<T>;
}

// Auth
export const api = {
  getMe: () => request<{ user: User | null }>("/auth/me"),
  logout: () => request<{ ok: boolean }>("/auth/logout"),

  // ── Events ──

  listEvents: (filters?: EventFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, val]) => {
        if (val !== undefined) params.set(key, String(val));
      });
    }
    const qs = params.toString();
    return request<PaginatedResponse<TimelineEvent>>(
      `/events${qs ? `?${qs}` : ""}`,
    );
  },

  getEvent: (id: string) =>
    request<{ event: TimelineEvent }>(`/events/${encodeURIComponent(id)}`),

  createEvent: (data: CreateEventInput) =>
    request<{ event: TimelineEvent }>("/events", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateEvent: (id: string, data: Partial<CreateEventInput>) =>
    request<{ event: TimelineEvent }>(`/events/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteEvent: (id: string) =>
    request<{ ok: boolean }>(`/events/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),

  approveEvent: (id: string, data: ApproveEventInput) =>
    request<{ event: TimelineEvent }>(
      `/events/${encodeURIComponent(id)}/approve`,
      { method: "POST", body: JSON.stringify(data) },
    ),

  // ── Event versions ──

  listEventVersions: (eventId: string) =>
    request<{ versions: EventVersion[] }>(
      `/events/${encodeURIComponent(eventId)}/versions`,
    ),

  // ── Categories ──

  listCategories: () => request<{ categories: Category[] }>("/categories"),

  createCategory: (data: CreateCategoryInput) =>
    request<{ category: Category }>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateCategory: (id: string, data: UpdateCategoryInput) =>
    request<{ category: Category }>(`/categories/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteCategory: (id: string) =>
    request<{ category: Category }>(`/categories/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),

  // ── Year stats ──

  listYearStats: () => request<{ years: YearStat[] }>("/years"),

  // ── Comments ──

  listComments: (eventId: string, page = 1, limit = 20) =>
    request<PaginatedComments>(
      `/events/${encodeURIComponent(eventId)}/comments?page=${page}&limit=${limit}`,
    ),

  createComment: (eventId: string, data: CreateCommentInput) =>
    request<{ comment: Comment }>(
      `/events/${encodeURIComponent(eventId)}/comments`,
      { method: "POST", body: JSON.stringify(data) },
    ),

  editComment: (id: string, text: string) =>
    request<{ comment: Comment }>(`/comments/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify({ text }),
    }),

  deleteComment: (id: string) =>
    request<{ ok: boolean }>(`/comments/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),

  // ── Reactions ──

  toggleReaction: (data: CreateReactionInput) =>
    request<{ action: "added" | "removed"; type: string }>("/reactions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getReactions: (targetType: string, targetId: string, userId?: string) => {
    const params = new URLSearchParams({ targetType, targetId });
    if (userId) params.set("userId", userId);
    return request<{ reactions: Reaction[] }>(`/reactions?${params}`);
  },

  // ── Reaction types ──

  listReactionTypes: () =>
    request<{ types: ReactionTypeConfig[] }>("/reaction-types"),

  createReactionType: (data: CreateReactionTypeInput) =>
    request<{ reactionType: ReactionTypeConfig }>("/reaction-types", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateReactionType: (id: string, data: UpdateReactionTypeInput) =>
    request<{ reactionType: ReactionTypeConfig }>(
      `/reaction-types/${encodeURIComponent(id)}`,
      { method: "PUT", body: JSON.stringify(data) },
    ),
};
