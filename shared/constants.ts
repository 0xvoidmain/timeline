export const VISIBILITY = ["public", "private", "anonymous"] as const;
export type Visibility = (typeof VISIBILITY)[number];

export const AUTH_PROVIDERS = ["google"] as const;
export type AuthProvider = (typeof AUTH_PROVIDERS)[number];
