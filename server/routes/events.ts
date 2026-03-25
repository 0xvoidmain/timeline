import type { BunRequest } from "bun";
import { Event } from "../models/Event.ts";
import { EventVersion } from "../models/EventVersion.ts";
import { Category } from "../models/Category.ts";
import { YearStat } from "../models/YearStat.ts";
import { requireAuth, requireRole } from "../middleware/auth.ts";
import {
  createEventSchema,
  updateEventSchema,
  listQuerySchema,
  approveEventSchema,
} from "../../shared/schemas.ts";

const OBJECT_ID_RE = /^[a-f0-9]{24}$/;

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function incrementStats(category: string, year: number) {
  await Promise.all([
    Category.findOneAndUpdate({ slug: category }, { $inc: { eventCount: 1 } }),
    YearStat.findOneAndUpdate(
      { year },
      { $inc: { eventCount: 1 }, $set: { updatedAt: new Date() } },
      { upsert: true },
    ),
  ]);
}

async function decrementStats(category: string, year: number) {
  await Promise.all([
    Category.findOneAndUpdate({ slug: category }, { $inc: { eventCount: -1 } }),
    YearStat.findOneAndUpdate(
      { year },
      { $inc: { eventCount: -1 }, $set: { updatedAt: new Date() } },
    ),
  ]);
}

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

      const {
        category,
        country,
        year,
        search,
        from,
        to,
        visibility,
        eventType,
        status,
        page,
        limit,
      } = parsed.data;
      const filter: Record<string, unknown> = {};
      if (category) filter.category = category;
      if (country) filter.country = country;
      if (eventType) filter.eventType = eventType;
      if (status) filter.status = status;
      if (visibility) filter.visibility = visibility;
      else filter.visibility = { $in: ["public", "anonymous"] };

      // Year filter: match events whose date falls within the year
      if (year) {
        filter.date = {
          $gte: new Date(`${year}-01-01T00:00:00.000Z`),
          $lte: new Date(`${year}-12-31T23:59:59.999Z`),
        };
      } else if (from || to) {
        filter.date = {};
        if (from)
          (filter.date as Record<string, unknown>).$gte = new Date(from);
        if (to) (filter.date as Record<string, unknown>).$lte = new Date(to);
      }

      // Full-text search
      if (search) {
        filter.$text = { $search: search };
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sortOption: any = search
        ? { score: { $meta: "textScore" }, date: -1 }
        : { date: -1 };

      const [events, total] = await Promise.all([
        Event.find(filter)
          .sort(sortOption)
          .skip((page - 1) * limit)
          .limit(limit)
          .populate("createdBy", "name avatar")
          .populate("approvedBy", "name avatar"),
        Event.countDocuments(filter),
      ]);

      return Response.json({ data: events, total, page, limit });
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

      const data = parsed.data;
      const slug = data.slug || slugify(data.title);
      const event = await Event.create({
        ...data,
        slug,
        createdBy: userId,
        contributors: [{ user: userId, role: "author" }],
      });

      // Create initial version snapshot
      await EventVersion.create({
        eventId: event._id,
        version: 1,
        snapshot: event.toObject(),
        editedBy: userId,
        editNote: "Initial version",
      });

      // Update stats
      const year = new Date(data.date).getFullYear();
      await incrementStats(data.category, year);

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
      const event = await Event.findById(id)
        .populate("createdBy", "name avatar")
        .populate("approvedBy", "name avatar")
        .populate("contributors.user", "name avatar");
      if (!event) return Response.json({ error: "Not found" }, { status: 404 });

      // Increment view count (fire-and-forget)
      Event.updateOne({ _id: id }, { $inc: { viewCount: 1 } }).exec();

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

        // Create version snapshot before applying changes
        await EventVersion.create({
          eventId: event._id,
          version: event.currentVersion,
          snapshot: event.toObject(),
          editedBy: userId,
        });

        Object.assign(event, parsed.data);
        event.currentVersion += 1;
        event.score = event.baseScore + event.engagementScore;
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

        const year = event.date.getFullYear();
        await event.deleteOne();
        await decrementStats(event.category, year);

        return Response.json({ ok: true });
      })(req);
    },
  },

  // ── Approval ──
  "/api/events/:id/approve": {
    POST: async (req: BunRequest<"/api/events/:id/approve">) => {
      const { id } = req.params;
      if (!OBJECT_ID_RE.test(id)) {
        return Response.json({ error: "Invalid event ID" }, { status: 400 });
      }
      return requireRole(
        "moderator",
        "admin",
      )(async (innerReq, userId) => {
        const body = await innerReq.json();
        const parsed = approveEventSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { error: "Validation failed", details: parsed.error.issues },
            { status: 400 },
          );
        }

        const event = await Event.findById(id);
        if (!event)
          return Response.json({ error: "Not found" }, { status: 404 });

        event.status = parsed.data.status;
        event.approvedBy = new (
          await import("mongoose")
        ).default.Types.ObjectId(userId);
        event.approvedAt = new Date();
        if (parsed.data.reviewNote) event.reviewNote = parsed.data.reviewNote;
        await event.save();

        return Response.json({ event });
      })(req);
    },
  },

  // ── Version history ──
  "/api/events/:id/versions": {
    GET: async (req: BunRequest<"/api/events/:id/versions">) => {
      const { id } = req.params;
      if (!OBJECT_ID_RE.test(id)) {
        return Response.json({ error: "Invalid event ID" }, { status: 400 });
      }

      const versions = await EventVersion.find({ eventId: id })
        .sort({ version: -1 })
        .populate("editedBy", "name avatar");

      return Response.json({ versions });
    },
  },
} as const;
