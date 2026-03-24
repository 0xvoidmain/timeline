import mongoose, { Schema, type InferSchemaType } from "mongoose";
import { VISIBILITY } from "../../shared/constants.ts";

const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    endDate: { type: Date },
    category: { type: String, required: true, index: true },
    country: { type: String, required: true, index: true },
    source: { type: String },
    sourceUrl: { type: String },
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
    media: [{ type: String }],
    tags: [{ type: String }],
  },
  { timestamps: true },
);

eventSchema.index({ date: -1 });
eventSchema.index({ category: 1, country: 1 });

export type IEvent = InferSchemaType<typeof eventSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const Event = mongoose.model("Event", eventSchema);
