import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/timeline";

export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("[db] Connected to MongoDB");
  } catch (error) {
    console.error("[db] Connection error:", error);
    process.exit(1);
  }

  mongoose.connection.on("error", (err) => {
    console.error("[db] MongoDB error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("[db] MongoDB disconnected");
  });
}
