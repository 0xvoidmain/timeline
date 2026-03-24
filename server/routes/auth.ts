import { generateCodeVerifier, generateState } from "arctic";
import { googleAuth } from "../config/oauth.ts";
import { User } from "../models/User.ts";
import { createToken, setAuthCookie, clearAuthCookie } from "../lib/jwt.ts";
import { getAuthUser } from "../middleware/auth.ts";

// In-memory store for OAuth state (use Redis in production)
const pendingStates = new Map<
  string,
  { verifier?: string; provider: string }
>();

export async function handleAuthRoutes(
  req: Request,
  path: string,
): Promise<Response | null> {
  // --- Google OAuth ---
  if (path === "/api/auth/google") {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const url = await googleAuth.createAuthorizationURL(state, codeVerifier, [
      "openid",
      "email",
      "profile",
    ]);
    pendingStates.set(state, { verifier: codeVerifier, provider: "google" });
    return Response.redirect(url.toString(), 302);
  }

  if (path === "/api/auth/google/callback") {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    if (!code || !state)
      return Response.json({ error: "Missing code or state" }, { status: 400 });

    const pending = pendingStates.get(state);
    if (!pending || pending.provider !== "google") {
      return Response.json({ error: "Invalid state" }, { status: 400 });
    }
    pendingStates.delete(state);

    const tokens = await googleAuth.validateAuthorizationCode(
      code,
      pending.verifier!,
    );
    const accessToken = tokens.accessToken();
    const res = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    const profile = (await res.json()) as {
      sub: string;
      email: string;
      name: string;
      picture?: string;
    };

    const user = await User.findOneAndUpdate(
      { provider: "google", providerId: profile.sub },
      {
        email: profile.email,
        name: profile.name,
        avatar: profile.picture ?? "",
        provider: "google",
        providerId: profile.sub,
      },
      { upsert: true, new: true },
    );

    const token = await createToken(user);
    const headers = new Headers({ Location: "/" });
    setAuthCookie(headers, token);
    return new Response(null, { status: 302, headers });
  }

  // --- Session ---
  if (path === "/api/auth/me") {
    const user = await getAuthUser(req);
    if (!user) return Response.json({ user: null }, { status: 401 });
    return Response.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    });
  }

  if (path === "/api/auth/logout") {
    const headers = new Headers();
    clearAuthCookie(headers);
    return Response.json({ ok: true }, { headers });
  }

  return null;
}
