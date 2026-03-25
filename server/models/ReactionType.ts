import mongoose, { Schema, type InferSchemaType } from "mongoose";

const reactionTypeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    icon: { type: String, required: true },
    label: { type: String, required: true },
    color: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

reactionTypeSchema.index({ order: 1 });
reactionTypeSchema.index({ isActive: 1 });

export type IReactionType = InferSchemaType<typeof reactionTypeSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const ReactionType = mongoose.model("ReactionType", reactionTypeSchema);
