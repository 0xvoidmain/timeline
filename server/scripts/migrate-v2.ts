/**
 * Migration v2 — Upgrade schema to support new features:
 * - Migrate source/sourceUrl → sources array
 * - Add default values for new Event fields
 * - Generate slugs for existing events
 * - Seed Category collection from existing event categories
 * - Seed Year collection from existing events
 * - Seed default ReactionType entries
 *
 * Run: bun run server/scripts/migrate-v2.ts
 */

import { connectDB } from "../config/db.ts";
import { Event } from "../models/Event.ts";
import { Category } from "../models/Category.ts";
import { Year } from "../models/Year.ts";
import { ReactionType } from "../models/ReactionType.ts";
import { DEFAULT_REACTION_TYPES } from "../../shared/constants.ts";

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function migrate() {
  await connectDB();
  console.log("[migrate-v2] Starting migration...");

  // ── 1. Migrate existing events ──
  const events = await Event.find({});
  console.log(`[migrate-v2] Found ${events.length} events to migrate`);

  for (const event of events) {
    const updates: Record<string, unknown> = {};

    // Generate slug if missing
    if (!event.slug) {
      updates.slug = slugify(event.title);
    }

    // Migrate source/sourceUrl to sources array
    const doc = event.toObject() as Record<string, unknown>;
    if (
      (doc.source || doc.sourceUrl) &&
      (!event.sources || event.sources.length === 0)
    ) {
      const sources: { title?: string; url: string }[] = [];
      if (doc.sourceUrl && typeof doc.sourceUrl === "string") {
        sources.push({
          title: typeof doc.source === "string" ? doc.source : undefined,
          url: doc.sourceUrl,
        });
      }
      updates.sources = sources;
    }

    // Set defaults for new fields
    if (!event.eventType) updates.eventType = "event";
    if (!event.status) updates.status = "draft";
    if (event.baseScore === undefined) updates.baseScore = 0;
    if (event.engagementScore === undefined) updates.engagementScore = 0;
    if (event.score === undefined) updates.score = 0;
    if (event.currentVersion === undefined) updates.currentVersion = 1;
    if (event.commentCount === undefined) updates.commentCount = 0;
    if (event.viewCount === undefined) updates.viewCount = 0;
    if (!event.reactionCounts) updates.reactionCounts = [];
    if (!event.metadata) updates.metadata = [];
    if (!event.contributors || event.contributors.length === 0) {
      updates.contributors = [
        {
          user: event.createdBy,
          role: "author",
          addedAt: event.createdAt || new Date(),
        },
      ];
    }

    if (Object.keys(updates).length > 0) {
      await Event.updateOne({ _id: event._id }, { $set: updates });
    }
  }

  // Remove old fields
  await Event.updateMany({}, { $unset: { source: "", sourceUrl: "" } });
  console.log("[migrate-v2] Events migrated");

  // ── 2. Seed categories from existing event categories ──
  const categories = await Event.distinct("category");
  console.log(`[migrate-v2] Found ${categories.length} distinct categories`);

  for (const name of categories) {
    const slug = slugify(name);
    const count = await Event.countDocuments({ category: name });
    await Category.findOneAndUpdate(
      { slug },
      {
        $setOnInsert: { name, slug, description: "", icon: "", color: "" },
        $set: { eventCount: count },
      },
      { upsert: true },
    );
  }
  console.log("[migrate-v2] Categories seeded");

  // ── 3. Seed year stats ──
  const yearAgg = await Event.aggregate([
    { $group: { _id: { $year: "$date" }, count: { $sum: 1 } } },
  ]);
  for (const { _id: year, count } of yearAgg) {
    await Year.findOneAndUpdate(
      { year },
      { $set: { eventCount: count, updatedAt: new Date() } },
      { upsert: true },
    );
  }
  console.log(`[migrate-v2] Seeded ${yearAgg.length} year stats`);

  // ── 4. Seed default reaction types ──
  const reactionTypeDefaults: Record<
    string,
    { icon: string; label: string; color: string }
  > = {
    like: { icon: "thumb_up", label: "Thích", color: "text-blue-400" },
    love: { icon: "favorite", label: "Yêu thích", color: "text-red-400" },
    sad: {
      icon: "sentiment_dissatisfied",
      label: "Buồn",
      color: "text-yellow-400",
    },
    wow: {
      icon: "sentiment_very_satisfied",
      label: "Wow",
      color: "text-orange-400",
    },
    angry: { icon: "mood_bad", label: "Phẫn nộ", color: "text-red-600" },
  };

  for (let i = 0; i < DEFAULT_REACTION_TYPES.length; i++) {
    const name = DEFAULT_REACTION_TYPES[i];
    const defaults = reactionTypeDefaults[name];
    await ReactionType.findOneAndUpdate(
      { name },
      {
        $setOnInsert: {
          name,
          icon: defaults.icon,
          label: defaults.label,
          color: defaults.color,
          order: i,
          isActive: true,
        },
      },
      { upsert: true },
    );
  }
  console.log("[migrate-v2] Default reaction types seeded");

  console.log("[migrate-v2] Migration complete!");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("[migrate-v2] Migration failed:", err);
  process.exit(1);
});
