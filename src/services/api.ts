import type {
  User,
  TimelineEvent,
  EventFilters,
  PaginatedResponse,
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

  // Events
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

  createEvent: (
    data: Omit<TimelineEvent, "_id" | "createdBy" | "createdAt" | "updatedAt">,
  ) =>
    request<{ event: TimelineEvent }>("/events", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateEvent: (id: string, data: Partial<TimelineEvent>) =>
    request<{ event: TimelineEvent }>(`/events/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteEvent: (id: string) =>
    request<{ ok: boolean }>(`/events/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
};
