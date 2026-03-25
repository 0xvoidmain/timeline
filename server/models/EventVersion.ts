import mongoose, { Schema, type InferSchemaType } from "mongoose";

const eventVersionSchema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    version: { type: Number, required: true },
    snapshot: { type: Schema.Types.Mixed, required: true },
    editedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    editNote: { type: String },
  },
  { timestamps: true },
);

eventVersionSchema.index({ eventId: 1, version: -1 }, { unique: true });
eventVersionSchema.index({ editedBy: 1 });

export type IEventVersion = InferSchemaType<typeof eventVersionSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const EventVersion = mongoose.model("EventVersion", eventVersionSchema);
