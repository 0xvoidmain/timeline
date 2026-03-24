import { z } from "zod/v4";
import { Event } from "../models/Event.ts";
import { requireAuth } from "../middleware/auth.ts";

const createEventSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  date: z.iso.datetime(),
  endDate: z.iso.datetime().optional(),
  category: z.string().min(1).max(100),
  country: z.string().min(1).max(100),
  source: z.string().max(200).optional(),
  sourceUrl: z.url().optional(),
  visibility: z.enum(["public", "private", "anonymous"]).default("public"),
  media: z.array(z.url()).max(10).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
});

const updateEventSchema = createEventSchema.partial();

const listQuerySchema = z.object({
  category: z.string().optional(),
  country: z.string().optional(),
  from: z.iso.datetime().optional(),
  to: z.iso.datetime().optional(),
  visibility: z.enum(["public", "private", "anonymous"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export async function handleEventRoutes(
  req: Request,
  path: string,
): Promise<Response | null> {
  const method = req.method;

  // GET /api/events — list with filters
  if (path === "/api/events" && method === "GET") {
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams);
    const parsed = listQuerySchema.safeParse(params);
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid query", details: parsed.error.issues },
        { status: 400 },
      );
    }

    const { category, country, from, to, visibility, page, limit } =
      parsed.data;
    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (country) filter.country = country;
    if (visibility) filter.visibility = visibility;
    else filter.visibility = { $in: ["public", "anonymous"] }; // default: public events
    if (from || to) {
      filter.date = {};
      if (from) (filter.date as Record<string, unknown>).$gte = new Date(from);
      if (to) (filter.date as Record<string, unknown>).$lte = new Date(to);
    }

    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("createdBy", "name avatar"),
      Event.countDocuments(filter),
    ]);

    return Response.json({ events, total, page, limit });
  }

  // GET /api/events/:id
  const singleMatch = path.match(/^\/api\/events\/([a-f0-9]{24})$/);
  if (singleMatch && method === "GET") {
    const event = await Event.findById(singleMatch[1]).populate(
      "createdBy",
      "name avatar",
    );
    if (!event) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ event });
  }

  // POST /api/events — create (auth required)
  if (path === "/api/events" && method === "POST") {
    return requireAuth(async (innerReq, userId) => {
      const body = await innerReq.json();
      const parsed = createEventSchema.safeParse(body);
      if (!parsed.success) {
        return Response.json(
          { error: "Validation failed", details: parsed.error.issues },
          { status: 400 },
        );
      }
      const event = await Event.create({ ...parsed.data, createdBy: userId });
      return Response.json({ event }, { status: 201 });
    })(req);
  }

  // PUT /api/events/:id — update own event (auth required)
  if (singleMatch && method === "PUT") {
    return requireAuth(async (innerReq, userId) => {
      const event = await Event.findById(singleMatch[1]);
      if (!event) return Response.json({ error: "Not found" }, { status: 404 });
      if (event.createdBy.toString() !== userId) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
      const body = await innerReq.json();
      const parsed = updateEventSchema.safeParse(body);
      if (!parsed.success) {
        return Response.json(
          { error: "Validation failed", details: parsed.error.issues },
          { status: 400 },
        );
      }
      Object.assign(event, parsed.data);
      await event.save();
      return Response.json({ event });
    })(req);
  }

  // DELETE /api/events/:id — delete own event (auth required)
  if (singleMatch && method === "DELETE") {
    return requireAuth(async (_innerReq, userId) => {
      const event = await Event.findById(singleMatch[1]);
      if (!event) return Response.json({ error: "Not found" }, { status: 404 });
      if (event.createdBy.toString() !== userId) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
      await event.deleteOne();
      return Response.json({ ok: true });
    })(req);
  }

  return null;
}
