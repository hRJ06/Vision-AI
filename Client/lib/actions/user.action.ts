"use server";
import db from "@/db/drizzle";
import { user } from "@/db/schema";
import { LoginUserProps, VerifyUserProps } from "@/types";
import { eq } from "drizzle-orm";
import { generateOTP, getCookieExpiration, getOTPExpiration } from "../utils";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "./mail.action";
import { connectToDB } from "../mongoose";
import Chat from "../model/chat.model";
import mongoose from "mongoose";
import { getCurrentUser, getUserChats } from "@/db/queries";

/* VERIFY USER */
export const verifyUser = async (userData: VerifyUserProps) => {
  try {
    const savedUser = await getCurrentUser(userData.email);
    if (savedUser[0]) {
      const db_user = savedUser[0];
      const generatedOTP = generateOTP();
      const expirationTime = getOTPExpiration();
      await db
        .update(user)
        .set({ otp: generatedOTP, expiresIn: expirationTime })
        .where(eq(user.email, userData.email));
      const req = {
        name: db_user.name as string,
        email: db_user.email,
        token: generatedOTP,
      };
      const response = await sendOTPEmail(req);
      if (response) {
        return JSON.stringify({ success: true });
      } else {
        return JSON.stringify({ success: false });
      }
    } else {
      return { success: false, message: "You are not registered with us." };
    }
  } catch (error) {
    console.error(error);
    return JSON.stringify({ success: false });
  }
};

/* LOGIN USER THROUGH OTP */
export const loginUser = async ({ otp, email }: LoginUserProps) => {
  try {
    const savedUser = await getCurrentUser(email);
    if (savedUser[0]) {
      const db_user = savedUser[0];
      if (db_user.otp != Number(otp)) {
        return JSON.stringify({ success: false });
      } else {
        const payload = {
          email: db_user.email,
          role: db_user.role,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
          expiresIn: process.env.JWT_EXPIRATION_TIME!,
        });
        cookies().set("token", token, {
          secure: true,
          expires: getCookieExpiration(),
        });
        cookies().set("role", db_user.role!, {
          secure: true,
          expires: getCookieExpiration(),
        });
        return JSON.stringify({ success: true });
      }
    }
  } catch (error) {
    console.error(error);
    return JSON.stringify({ success: false });
  }
};

/* GET USER CHATS */
export const userChats = async (email: string) => {
  try {
    const currentUser = await getUserChats(email);
    connectToDB();
    if (currentUser[0]) {
      const chats = currentUser[0].chats?.map((id) => id.replace(/"/g, ""));
      const chatObjectIds = chats?.map((id) => new mongoose.Types.ObjectId(id));
      const populatedChats = await Chat.find({ _id: { $in: chatObjectIds } });
      return JSON.stringify({ success: true, chats: populatedChats });
    } else {
      return JSON.stringify({ success: false, message: "Invalid Token" });
    }
  } catch (error) {
    console.error(error);
    return JSON.stringify({ success: false });
  }
};
