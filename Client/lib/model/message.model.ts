"use server";
import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["AI", "USER"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
export default message;
