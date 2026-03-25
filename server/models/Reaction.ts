import mongoose, { Schema, type InferSchemaType } from "mongoose";
import { REACTION_TARGET } from "../../shared/constants.ts";

const reactionSchema = new Schema({
  targetType: {
    type: String,
    required: true,
    enum: REACTION_TARGET,
  },
  targetId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

reactionSchema.index(
  { targetType: 1, targetId: 1, userId: 1, type: 1 },
  { unique: true },
);
reactionSchema.index({ targetType: 1, targetId: 1 });
reactionSchema.index({ userId: 1 });

export type IReaction = InferSchemaType<typeof reactionSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const Reaction = mongoose.model("Reaction", reactionSchema);
