import mongoose, { Schema, type InferSchemaType } from "mongoose";

const yearStatSchema = new Schema({
  year: { type: Number, required: true, unique: true },
  eventCount: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

yearStatSchema.index({ eventCount: -1 });

export type IYearStat = InferSchemaType<typeof yearStatSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const YearStat = mongoose.model("YearStat", yearStatSchema);
