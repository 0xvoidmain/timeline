import mongoose, { Schema, type InferSchemaType } from "mongoose";
import {
  VISIBILITY,
  EVENT_STATUS,
  EVENT_TYPE,
} from "../../shared/constants.ts";

const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    endDate: { type: Date },
    image: { type: String },
    category: { type: String, required: true, index: true },
    country: { type: String, required: true, index: true },
    eventType: {
      type: String,
      required: true,
      enum: EVENT_TYPE,
      default: "event",
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: EVENT_STATUS,
      default: "draft",
      index: true,
    },
    visibility: {
      type: String,
      required: true,
      enum: VISIBILITY,
      default: "public",
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Approval
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    reviewNote: { type: String },
    // Contributors
    contributors: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        role: { type: String, default: "contributor" },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    // Scoring
    baseScore: { type: Number, default: 0 },
    engagementScore: { type: Number, default: 0 },
    score: { type: Number, default: 0, index: true },
    // Sources (replaces source/sourceUrl)
    sources: [
      {
        title: { type: String },
        content: { type: String },
        url: { type: String, required: true },
      },
    ],
    // Flexible metadata: {label, info, group}
    metadata: [
      {
        label: { type: String, required: true },
        info: { type: String, required: true },
        group: { type: String },
      },
    ],
    // Anniversary / period
    period: {
      startYear: { type: Number },
      endYear: { type: Number },
      description: { type: String },
    },
    // Versioning
    currentVersion: { type: Number, default: 1 },
    // Denormalized engagement counts
    reactionCounts: [
      {
        type: { type: String, required: true },
        count: { type: Number, default: 0 },
      },
    ],
    commentCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    // Existing
    media: [{ type: String }],
    tags: [{ type: String }],
  },
  { timestamps: true },
);

eventSchema.index({ date: -1 });
eventSchema.index({ category: 1, country: 1 });
eventSchema.index({ score: -1 });
eventSchema.index({ "contributors.user": 1 });

export type IEvent = InferSchemaType<typeof eventSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const Event = mongoose.model("Event", eventSchema);
