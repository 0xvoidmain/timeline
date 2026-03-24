import { Google } from "arctic";

const googleAuth = new Google(
  process.env.GOOGLE_CLIENT_ID ?? "",
  process.env.GOOGLE_CLIENT_SECRET ?? "",
  process.env.GOOGLE_REDIRECT_URI ??
    "http://localhost:3000/api/auth/google/callback",
);

export { googleAuth };
