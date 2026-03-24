import { connectDB } from "./config/db.ts";
import { handleAuthRoutes } from "./routes/auth.ts";
import { handleEventRoutes } from "./routes/events.ts";

const PORT = Number(process.env.PORT) || 3000;

await connectDB();

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    // CORS headers for development
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

    // Auth routes
    if (path.startsWith("/api/auth")) {
      const res = await handleAuthRoutes(req, path);
      if (res) return res;
    }

    // Event routes
    if (path.startsWith("/api/events")) {
      const res = await handleEventRoutes(req, path);
      if (res) return res;
    }

    // Health check
    if (path === "/api/health") {
      return Response.json({
        status: "ok",
        timestamp: new Date().toISOString(),
      });
    }

    return Response.json({ error: "Not found" }, { status: 404 });
  },
});

console.log(`[server] Running on http://localhost:${PORT}`);
