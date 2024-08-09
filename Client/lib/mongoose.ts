import mongoose from "mongoose";
let isConnected = false;

export const connectToDB = async () => {
  if (!process.env.MONGODB_URI) return console.log("MONGODB_URL is required");
  if (isConnected) return console.log("Already connected");
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
  } catch (e) {
    console.error("Error");
  }
};
