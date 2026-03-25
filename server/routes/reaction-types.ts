import type { BunRequest } from "bun";
import { ReactionType } from "../models/ReactionType.ts";
import { requireRole } from "../middleware/auth.ts";
import {
  createReactionTypeSchema,
  updateReactionTypeSchema,
} from "../../shared/schemas.ts";

const OBJECT_ID_RE = /^[a-f0-9]{24}$/;

export const reactionTypeRoutes = {
  "/api/reaction-types": {
    // GET — list active reaction types
    GET: async () => {
      const types = await ReactionType.find({ isActive: true }).sort({
        order: 1,
      });
      return Response.json({ types });
    },

    // POST — create (admin only)
    POST: requireRole("admin")(async (req) => {
      const body = await req.json();
      const parsed = createReactionTypeSchema.safeParse(body);
      if (!parsed.success) {
        return Response.json(
          { error: "Validation failed", details: parsed.error.issues },
          { status: 400 },
        );
      }
      const reactionType = await ReactionType.create(parsed.data);
      return Response.json({ reactionType }, { status: 201 });
    }),
  },

  "/api/reaction-types/:id": {
    // PUT — update (admin only)
    PUT: async (req: BunRequest<"/api/reaction-types/:id">) => {
      const { id } = req.params;
      if (!OBJECT_ID_RE.test(id)) {
        return Response.json(
          { error: "Invalid reaction type ID" },
          { status: 400 },
        );
      }

      return requireRole("admin")(async (innerReq) => {
        const body = await innerReq.json();
        const parsed = updateReactionTypeSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { error: "Validation failed", details: parsed.error.issues },
            { status: 400 },
          );
        }

        const reactionType = await ReactionType.findByIdAndUpdate(
          id,
          parsed.data,
          { new: true },
        );
        if (!reactionType)
          return Response.json({ error: "Not found" }, { status: 404 });

        return Response.json({ reactionType });
      })(req);
    },
  },
} as const;
