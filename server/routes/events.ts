import type { BunRequest } from "bun";
import { Event } from "../models/Event.ts";
import { requireAuth } from "../middleware/auth.ts";
import {
  createEventSchema,
  updateEventSchema,
  listQuerySchema,
} from "../../shared/schemas.ts";

const OBJECT_ID_RE = /^[a-f0-9]{24}$/;

export const eventRoutes = {
  "/api/events": {
    // GET /api/events — list with filters
    GET: async (req: Request) => {
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
        if (from)
          (filter.date as Record<string, unknown>).$gte = new Date(from);
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
    },

    // POST /api/events — create (auth required)
    POST: requireAuth(async (req, userId) => {
      const body = await req.json();
      const parsed = createEventSchema.safeParse(body);
      if (!parsed.success) {
        return Response.json(
          { error: "Validation failed", details: parsed.error.issues },
          { status: 400 },
        );
      }
      const event = await Event.create({ ...parsed.data, createdBy: userId });
      return Response.json({ event }, { status: 201 });
    }),
  },

  "/api/events/:id": {
    // GET /api/events/:id
    GET: async (req: BunRequest<"/api/events/:id">) => {
      const { id } = req.params;
      if (!OBJECT_ID_RE.test(id)) {
        return Response.json({ error: "Invalid event ID" }, { status: 400 });
      }
      const event = await Event.findById(id).populate(
        "createdBy",
        "name avatar",
      );
      if (!event) return Response.json({ error: "Not found" }, { status: 404 });
      return Response.json({ event });
    },

    // PUT /api/events/:id — update own event (auth required)
    PUT: async (req: BunRequest<"/api/events/:id">) => {
      const { id } = req.params;
      if (!OBJECT_ID_RE.test(id)) {
        return Response.json({ error: "Invalid event ID" }, { status: 400 });
      }
      return requireAuth(async (innerReq, userId) => {
        const event = await Event.findById(id);
        if (!event)
          return Response.json({ error: "Not found" }, { status: 404 });
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
    },

    // DELETE /api/events/:id — delete own event (auth required)
    DELETE: async (req: BunRequest<"/api/events/:id">) => {
      const { id } = req.params;
      if (!OBJECT_ID_RE.test(id)) {
        return Response.json({ error: "Invalid event ID" }, { status: 400 });
      }
      return requireAuth(async (_innerReq, userId) => {
        const event = await Event.findById(id);
        if (!event)
          return Response.json({ error: "Not found" }, { status: 404 });
        if (event.createdBy.toString() !== userId) {
          return Response.json({ error: "Forbidden" }, { status: 403 });
        }
        await event.deleteOne();
        return Response.json({ ok: true });
      })(req);
    },
  },
} as const;
