import mongoose from "mongoose";

const uri =
"mongodb+srv://lokeshpuma:Lokesh%401@cluster0.lqhoua3.mongodb.net/?appName=Cluster0"

export async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}
