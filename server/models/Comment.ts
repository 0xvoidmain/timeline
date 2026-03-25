import mongoose, { Schema, type InferSchemaType } from "mongoose";

const MAX_REPLY_DEPTH = 3;

const commentSchema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, required: true, maxlength: 2000 },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    depth: { type: Number, default: 0, max: MAX_REPLY_DEPTH },
    reactionCounts: [
      {
        type: { type: String, required: true },
        count: { type: Number, default: 0 },
      },
    ],
    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date },
  },
  { timestamps: true },
);

commentSchema.index({ eventId: 1, createdAt: -1 });
commentSchema.index({ parentId: 1 });
commentSchema.index({ author: 1 });

export { MAX_REPLY_DEPTH };
export type IComment = InferSchemaType<typeof commentSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const Comment = mongoose.model("Comment", commentSchema);
