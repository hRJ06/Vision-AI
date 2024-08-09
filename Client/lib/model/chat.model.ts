"use server";
import mongoose from "mongoose";
const chatSchema = new mongoose.Schema({
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

const chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
export default chat;
