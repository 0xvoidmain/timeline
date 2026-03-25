import type { BunRequest } from "bun";
import { Category } from "../models/Category.ts";
import { requireRole } from "../middleware/auth.ts";
import {
  createCategorySchema,
  updateCategorySchema,
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

export const categoryRoutes = {
  "/api/categories": {
    // GET — list all active categories
    GET: async () => {
      const categories = await Category.find({ isActive: true }).sort({
        order: 1,
      });
      return Response.json({ categories });
    },

    // POST — create (admin only)
    POST: requireRole("admin")(async (req) => {
      const body = await req.json();
      const parsed = createCategorySchema.safeParse(body);
      if (!parsed.success) {
        return Response.json(
          { error: "Validation failed", details: parsed.error.issues },
          { status: 400 },
        );
      }

      const data = parsed.data;
      const slug = data.slug || slugify(data.name);
      const category = await Category.create({ ...data, slug });
      return Response.json({ category }, { status: 201 });
    }),
  },

  "/api/categories/:id": {
    // PUT — update (admin only)
    PUT: async (req: BunRequest<"/api/categories/:id">) => {
      const { id } = req.params;
      if (!OBJECT_ID_RE.test(id)) {
        return Response.json({ error: "Invalid category ID" }, { status: 400 });
      }

      return requireRole("admin")(async (innerReq) => {
        const body = await innerReq.json();
        const parsed = updateCategorySchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { error: "Validation failed", details: parsed.error.issues },
            { status: 400 },
          );
        }

        const category = await Category.findByIdAndUpdate(id, parsed.data, {
          new: true,
        });
        if (!category)
          return Response.json({ error: "Not found" }, { status: 404 });

        return Response.json({ category });
      })(req);
    },

    // DELETE — soft delete (admin only)
    DELETE: async (req: BunRequest<"/api/categories/:id">) => {
      const { id } = req.params;
      if (!OBJECT_ID_RE.test(id)) {
        return Response.json({ error: "Invalid category ID" }, { status: 400 });
      }

      return requireRole("admin")(async () => {
        const category = await Category.findByIdAndUpdate(
          id,
          { isActive: false },
          { new: true },
        );
        if (!category)
          return Response.json({ error: "Not found" }, { status: 404 });

        return Response.json({ category });
      })(req);
    },
  },
} as const;
