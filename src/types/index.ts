export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
}

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
  visibility: "public" | "private" | "anonymous";
  createdBy: { _id: string; name: string; avatar: string };
  media: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EventFilters {
  category?: string;
  country?: string;
  from?: string;
  to?: string;
  visibility?: "public" | "private" | "anonymous";
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  events: T[];
  total: number;
  page: number;
  limit: number;
}
