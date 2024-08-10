"use server";
import mongoose from "mongoose";
const chatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  user: Number
});

const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
export default Chat;
