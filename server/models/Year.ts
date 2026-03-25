import mongoose, { Schema, type InferSchemaType } from "mongoose";

const yearSchema = new Schema(
  {
    year: { type: Number, required: true, unique: true },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    eventCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

yearSchema.index({ eventCount: -1 });

export type IYear = InferSchemaType<typeof yearSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const Year = mongoose.model("Year", yearSchema);
