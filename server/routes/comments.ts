import type { BunRequest } from "bun";
import { Comment, MAX_REPLY_DEPTH } from "../models/Comment.ts";
import { Event } from "../models/Event.ts";
import { User } from "../models/User.ts";
import { requireAuth } from "../middleware/auth.ts";
import { createCommentSchema } from "../../shared/schemas.ts";

const OBJECT_ID_RE = /^[a-f0-9]{24}$/;

export const commentRoutes = {
  "/api/events/:eventId/comments": {
    // GET — list top-level comments for an event (paginated, includes replies)
    GET: async (req: BunRequest<"/api/events/:eventId/comments">) => {
      const { eventId } = req.params;
      if (!OBJECT_ID_RE.test(eventId)) {
        return Response.json({ error: "Invalid event ID" }, { status: 400 });
      }

      const url = new URL(req.url);
      const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
      const limit = Math.min(
        50,
        Math.max(1, Number(url.searchParams.get("limit")) || 20),
      );

      const filter = { eventId, parentId: null };
      const [comments, total] = await Promise.all([
        Comment.find(filter)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .populate("author", "name avatar"),
        Comment.countDocuments(filter),
      ]);

      // Load replies (up to MAX_REPLY_DEPTH) for each top-level comment
      const commentIds = comments.map((c) => c._id);
      const replies = await Comment.find({ parentId: { $in: commentIds } })
        .sort({ createdAt: 1 })
        .populate("author", "name avatar");

      // Build nested structure
      const replyMap = new Map<string, typeof replies>();
      for (const reply of replies) {
        const pid = reply.parentId!.toString();
        if (!replyMap.has(pid)) replyMap.set(pid, []);
        replyMap.get(pid)!.push(reply);
      }

      const result = comments.map((c) => ({
        ...c.toObject(),
        replies: replyMap.get(c._id.toString()) || [],
      }));

      return Response.json({ comments: result, total, page, limit });
    },

    // POST — create comment (auth required)
    POST: async (req: BunRequest<"/api/events/:eventId/comments">) => {
      const { eventId } = req.params;
      if (!OBJECT_ID_RE.test(eventId)) {
        return Response.json({ error: "Invalid event ID" }, { status: 400 });
      }

      return requireAuth(async (innerReq, userId) => {
        const body = await innerReq.json();
        const parsed = createCommentSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { error: "Validation failed", details: parsed.error.issues },
            { status: 400 },
          );
        }

        // Verify event exists
        const event = await Event.findById(eventId);
        if (!event)
          return Response.json({ error: "Event not found" }, { status: 404 });

        let depth = 0;
        if (parsed.data.parentId) {
          if (!OBJECT_ID_RE.test(parsed.data.parentId)) {
            return Response.json(
              { error: "Invalid parent comment ID" },
              { status: 400 },
            );
          }
          const parent = await Comment.findById(parsed.data.parentId);
          if (!parent)
            return Response.json(
              { error: "Parent comment not found" },
              { status: 404 },
            );
          if (parent.eventId.toString() !== eventId) {
            return Response.json(
              { error: "Parent comment belongs to a different event" },
              { status: 400 },
            );
          }
          if (parent.depth >= MAX_REPLY_DEPTH) {
            return Response.json(
              { error: `Max reply depth of ${MAX_REPLY_DEPTH} reached` },
              { status: 400 },
            );
          }
          depth = parent.depth + 1;
        }

        const comment = await Comment.create({
          eventId,
          author: userId,
          text: parsed.data.text,
          parentId: parsed.data.parentId || null,
          depth,
        });

        // Increment event comment count
        await Event.updateOne({ _id: eventId }, { $inc: { commentCount: 1 } });

        const populated = await comment.populate("author", "name avatar");
        return Response.json({ comment: populated }, { status: 201 });
      })(req);
    },
  },

  "/api/comments/:id": {
    // PUT — edit own comment
    PUT: async (req: BunRequest<"/api/comments/:id">) => {
      const { id } = req.params;
      if (!OBJECT_ID_RE.test(id)) {
        return Response.json({ error: "Invalid comment ID" }, { status: 400 });
      }

      return requireAuth(async (innerReq, userId) => {
        const comment = await Comment.findById(id);
        if (!comment)
          return Response.json({ error: "Not found" }, { status: 404 });
        if (comment.author.toString() !== userId) {
          return Response.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await innerReq.json();
        const text = body?.text;
        if (!text || typeof text !== "string" || text.length > 2000) {
          return Response.json({ error: "Invalid text" }, { status: 400 });
        }

        comment.text = text;
        comment.isEdited = true;
        comment.editedAt = new Date();
        await comment.save();

        return Response.json({ comment });
      })(req);
    },

    // DELETE — delete own comment (moderator/admin can delete any)
    DELETE: async (req: BunRequest<"/api/comments/:id">) => {
      const { id } = req.params;
      if (!OBJECT_ID_RE.test(id)) {
        return Response.json({ error: "Invalid comment ID" }, { status: 400 });
      }

      return requireAuth(async (_innerReq, userId) => {
        const comment = await Comment.findById(id);
        if (!comment)
          return Response.json({ error: "Not found" }, { status: 404 });

        // Check ownership or moderator/admin role
        if (comment.author.toString() !== userId) {
          const user = await User.findById(userId).select("role");
          if (!user || !["moderator", "admin"].includes(user.role)) {
            return Response.json({ error: "Forbidden" }, { status: 403 });
          }
        }

        const eventId = comment.eventId;
        await comment.deleteOne();

        // Decrement event comment count
        await Event.updateOne({ _id: eventId }, { $inc: { commentCount: -1 } });

        return Response.json({ ok: true });
      })(req);
    },
  },
} as const;
