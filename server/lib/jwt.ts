import * as jose from "jose";
import type { IUser } from "../models/User.ts";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "change-me-to-a-random-secret",
);

export async function createToken(user: IUser): Promise<string> {
  return new jose.SignJWT({ sub: user._id.toString(), email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

export function setAuthCookie(headers: Headers, token: string) {
  headers.set(
    "Set-Cookie",
    `token=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 7}`,
  );
}

export function clearAuthCookie(headers: Headers) {
  headers.set(
    "Set-Cookie",
    "token=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0",
  );
}

export function getTokenFromCookies(
  cookieHeader: string | null,
): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|;\s*)token=([^;]*)/);
  return match ? match[1] : null;
}
