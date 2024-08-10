import { CreateChatParams } from "@/types";
import { connectToDB } from "../mongoose";
import Chat from "../model/chat.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import db from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

/* CREATE CHAT */
export async function createChat({ token, name }: CreateChatParams) {
  try {
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
      return JSON.stringify({ success: false, token: "Invalid Token" });
    }
  } catch (err: any) {
    console.error(err);
    throw new Error(`Failed to create chat: ${err.message}`);
  }
}
