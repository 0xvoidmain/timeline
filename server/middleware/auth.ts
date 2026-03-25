import { User } from "../models/User.ts";
import { verifyToken, getTokenFromCookies } from "../lib/jwt.ts";
import type { UserRole } from "../../shared/constants.ts";

export async function getAuthUser(req: Request) {
  const cookie = req.headers.get("cookie");
  const token = getTokenFromCookies(cookie);
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload?.sub) return null;

  return User.findById(payload.sub);
}

export function requireAuth(
  handler: (req: Request, userId: string) => Promise<Response>,
) {
  return async (req: Request): Promise<Response> => {
    const cookie = req.headers.get("cookie");
    const token = getTokenFromCookies(cookie);
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload?.sub) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    return handler(req, payload.sub as string);
  };
}

/** Require auth + one of the given roles */
export function requireRole(...roles: UserRole[]) {
  return (handler: (req: Request, userId: string) => Promise<Response>) =>
    async (req: Request): Promise<Response> => {
      const cookie = req.headers.get("cookie");
      const token = getTokenFromCookies(cookie);
      if (!token) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }

      const payload = await verifyToken(token);
      if (!payload?.sub) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }

      const user = await User.findById(payload.sub).select("role");
      if (!user || !roles.includes(user.role as UserRole)) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }

      return handler(req, payload.sub as string);
    };
}
