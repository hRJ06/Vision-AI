"use server";
import { AddChatMessageProps } from "@/types";
import { connectToDB } from "../mongoose";
import Chat from "../model/chat.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import db from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import Message from "../model/message.model";

/* CREATE CHAT */
export async function createChat(name: string) {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      return JSON.stringify({ success: false, message: "Please login" });
    }
    connectToDB();
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY!) as JwtPayload;
    const email = decode.email as string;
    const currentUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email));
    if (currentUser[0]) {
      const createdChat = await Chat.create({
        name: name,
        email: currentUser[0].email,
        user: currentUser[0].id,
      });
      return JSON.stringify({ success: true, chat: createdChat });
    } else {
      return JSON.stringify({ success: false, message: "Invalid Token" });
    }
  } catch (err: any) {
    console.error(err);
    throw new Error(`Failed to create chat: ${err.message}`);
  }
}

/* ADD MESSAGE TO CHAT */
export async function addMessage({ id, msg, role, link }: AddChatMessageProps) {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      return JSON.stringify({ success: false, message: "Please login" });
    }
    connectToDB();
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY!) as JwtPayload;
    const email = decode.email as string;
    const currentUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email));
    if (currentUser[0]) {
      const chat = await Chat.findOne({ _id: id, user: currentUser[0].id });
      if (!chat) {
        return JSON.stringify({ success: false, message: "Invalid Token" });
      } else {
        const createdMessage = await Message.create({
          role,
          content: msg,
          link,
        });
        chat.messages.push(createdMessage);
        await chat.save();
        return JSON.stringify({
          success: true,
          message: "Successfully added message",
        });
      }
    } else {
      return JSON.stringify({ success: false, message: "Invalid Token" });
    }
  } catch (error: any) {
    console.error(error);
    throw new Error(`Failed to add message: ${error.message}`);
  }
}

/* GET MESSAGES FROM CHAT */
export async function getAllMessages(id: string) {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      return JSON.stringify({ success: false, message: "Please login" });
    }
    connectToDB();
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY!) as JwtPayload;
    const email = decode.email as string;
    const currentUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email));
    if (currentUser[0]) {
      const chat = await Chat.findOne({ _id: id, user: currentUser[0].id });
      if (!chat) {
        return JSON.stringify({ success: false, message: "Invalid Token" });
      }
      return JSON.stringify({
        success: true,
        message: chat.messages,
      });
    } else {
      return JSON.stringify({ success: false, message: "Invalid Token" });
    }
  } catch (error: any) {
    console.error(error);
    throw new Error(`Failed to add message: ${error.message}`);
  }
}
