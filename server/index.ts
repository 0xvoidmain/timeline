import { connectDB } from "./config/db.ts";
import { authRoutes } from "./routes/auth.ts";
import { eventRoutes } from "./routes/events.ts";
import { commentRoutes } from "./routes/comments.ts";
import { reactionRoutes } from "./routes/reactions.ts";
import { categoryRoutes } from "./routes/categories.ts";
import { yearRoutes } from "./routes/years.ts";
import { reactionTypeRoutes } from "./routes/reaction-types.ts";

const PORT = Number(process.env.PORT) || 3000;

await connectDB();

Bun.serve({
  port: PORT,
  routes: {
    "/api/health": () =>
      Response.json({
        status: "ok",
        timestamp: new Date().toISOString(),
      }),
    ...authRoutes,
    ...eventRoutes,
    ...commentRoutes,
    ...reactionRoutes,
    ...categoryRoutes,
    ...yearRoutes,
    ...reactionTypeRoutes,
  },
  fetch(req) {
    // CORS preflight for development
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Credentials": "true",
        },
      });
    }

    return Response.json({ error: "Not found" }, { status: 404 });
  },
});

console.log(`[server] Running on http://localhost:${PORT}`);
