import mongoose, { Schema, type InferSchemaType } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  avatar: { type: String, default: "" },
  provider: { type: String, required: true, enum: ["google"] },
  providerId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

userSchema.index({ provider: 1, providerId: 1 }, { unique: true });

export type IUser = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const User = mongoose.model("User", userSchema);
