"use server";
import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["AI", "User"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
});

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
export default Message;
