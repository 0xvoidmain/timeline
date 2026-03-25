import { Reaction } from "../models/Reaction.ts";
import { Event } from "../models/Event.ts";
import { Comment } from "../models/Comment.ts";
import { requireAuth } from "../middleware/auth.ts";
import { createReactionSchema } from "../../shared/schemas.ts";

const OBJECT_ID_RE = /^[a-f0-9]{24}$/;

export const reactionRoutes = {
  "/api/reactions": {
    // POST — toggle reaction (create or remove)
    POST: requireAuth(async (req, userId) => {
      const body = await req.json();
      const parsed = createReactionSchema.safeParse(body);
      if (!parsed.success) {
        return Response.json(
          { error: "Validation failed", details: parsed.error.issues },
          { status: 400 },
        );
      }

      const { targetType, targetId, type } = parsed.data;
      if (!OBJECT_ID_RE.test(targetId)) {
        return Response.json({ error: "Invalid target ID" }, { status: 400 });
      }

      // Verify target exists
      const target =
        targetType === "event"
          ? await Event.findById(targetId)
          : await Comment.findById(targetId);
      if (!target) {
        return Response.json({ error: "Target not found" }, { status: 404 });
      }

      // Check if reaction already exists
      const existing = await Reaction.findOne({
        targetType,
        targetId,
        userId,
        type,
      });

      if (existing) {
        // Remove reaction
        await existing.deleteOne();
        // Decrement count on target
        if (targetType === "event") {
          await Event.updateOne(
            { _id: targetId, "reactionCounts.type": type },
            { $inc: { "reactionCounts.$.count": -1 } },
          );
        } else {
          await Comment.updateOne(
            { _id: targetId, "reactionCounts.type": type },
            { $inc: { "reactionCounts.$.count": -1 } },
          );
        }
        return Response.json({ action: "removed", type });
      }

      // Create reaction
      await Reaction.create({ targetType, targetId, userId, type });

      // Update count — increment existing or push new entry
      if (targetType === "event") {
        const updated = await Event.updateOne(
          { _id: targetId, "reactionCounts.type": type },
          { $inc: { "reactionCounts.$.count": 1 } },
        );
        if (updated.modifiedCount === 0) {
          await Event.updateOne(
            { _id: targetId },
            { $push: { reactionCounts: { type, count: 1 } } },
          );
        }
      } else {
        const updated = await Comment.updateOne(
          { _id: targetId, "reactionCounts.type": type },
          { $inc: { "reactionCounts.$.count": 1 } },
        );
        if (updated.modifiedCount === 0) {
          await Comment.updateOne(
            { _id: targetId },
            { $push: { reactionCounts: { type, count: 1 } } },
          );
        }
      }

      return Response.json({ action: "added", type });
    }),

    // GET — get user's reactions for a target
    GET: async (req: Request) => {
      const url = new URL(req.url);
      const targetType = url.searchParams.get("targetType");
      const targetId = url.searchParams.get("targetId");
      const userId = url.searchParams.get("userId");

      if (!targetType || !targetId) {
        return Response.json(
          { error: "targetType and targetId are required" },
          { status: 400 },
        );
      }
      if (!OBJECT_ID_RE.test(targetId)) {
        return Response.json({ error: "Invalid target ID" }, { status: 400 });
      }

      const filter: Record<string, unknown> = { targetType, targetId };
      if (userId && OBJECT_ID_RE.test(userId)) {
        filter.userId = userId;
      }

      const reactions = await Reaction.find(filter);
      return Response.json({ reactions });
    },
  },
} as const;
