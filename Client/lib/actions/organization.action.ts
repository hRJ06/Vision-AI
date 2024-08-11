"use server";
import db from "@/db/drizzle";
import { organization, user } from "@/db/schema";
import {
  UserProps,
  LoginOrganizationProps,
  RegisterOrganizationProps,
} from "@/types";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { getCookieExpiration } from "../utils";

/* REGISTER ORGANIZATION */
export const registerOrganization = async (
  organizationData: RegisterOrganizationProps
) => {
  try {
    const savedOrganization = await db
      .select()
      .from(organization)
      .where(eq(organization.email, organizationData.email));
    if (savedOrganization.length > 0) {
      return JSON.stringify({
        success: false,
        message: "You are already registered.",
      });
    }
    const hashedPassword = await bcrypt.hash(organizationData.password, 10);
    await db
      .insert(organization)
      .values({ ...organizationData, password: hashedPassword });
    return JSON.stringify({ success: true });
  } catch (error) {
    console.error(error);
    return { success: false, message: "Please Try Again." };
  }
};

/* LOGIN ORGANIZATION */
export const loginOrganization = async (
  organizationData: LoginOrganizationProps
) => {
  try {
    const savedOrganization = await db
      .select()
      .from(organization)
      .where(eq(organization.email, organizationData.email))
      .limit(1);
    if (savedOrganization[0]) {
      const match = await bcrypt.compare(
        organizationData.password,
        savedOrganization[0].password as string
      );
      if (match) {
        const payload = {
          email: organizationData.email,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
          expiresIn: process.env.JWT_EXPIRATION_TIME!,
        });
        cookies().set("token", token, {
          secure: true,
          expires: getCookieExpiration(),
        });
        return JSON.stringify({ success: true });
      } else {
        return { success: false, message: "Password don't match." };
      }
    } else {
      return { success: false, message: "You are not registered with us." };
    }
  } catch (error) {
    console.error(error);
    return JSON.stringify({ sucess: false });
  }
};

/* ADD NEW USER TO AN ORGANIZATION */
export const addUser = async (userData: UserProps) => {
  try {
    try {
      const decode = jwt.verify(
        userData.token,
        process.env.JWT_SECRET_KEY!
      ) as JwtPayload;
      const email = decode.email as string;
      const currentOrganization = await db
        .select()
        .from(organization)
        .where(eq(organization.email, email));
      if (currentOrganization[0]) {
        const newUser = {
          name: userData.name,
          email: userData.email,
          role: userData.role,
          organizationId: currentOrganization[0].id,
        };
        await db.insert(user).values(newUser);
      } else {
        return JSON.stringify({ success: false, token: "Invalid Token" });
      }
    } catch (error) {
      return JSON.stringify({ success: false, token: "Invalid Token" });
    }
  } catch (error) {
    console.error(error);
  }
};

/* DELETE USER FROM ORGANIZATION */
export const deleteUser = async (email: string) => {
  try {
    await db.delete(user).where(eq(user.email, email));
    return JSON.stringify({ success: true });
  } catch (error) {
    console.error(error);
    return JSON.stringify({ sucess: false });
  }
};

/* GET ALL USER FROM AN ORGANIZATION */
export const getUsers = async (token: string) => {
  try {
    try {
      const decode = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY!
      ) as JwtPayload;
      const email = decode.email as string;
      const currentOrganization = await db
        .select()
        .from(organization)
        .where(eq(organization.email, email));
      if (currentOrganization[0]) {
        const users = await db
          .select()
          .from(user)
          .where(eq(user.organizationId, currentOrganization[0].id));
        return users;
      } else {
        return JSON.stringify({ success: false, token: "Invalid Token" });
      }
    } catch (error) {
      return JSON.stringify({ success: false, token: "Invalid Token" });
    }
  } catch (error) {
    console.error(error);
    return JSON.stringify({ success: false, message: "Please Try Again." });
  }
};

/* EDIT AN USER OF AN ORGANIZATION */
export const editUser = async (userData: UserProps) => {
  try {
    const editedUser = {
      name: userData.name,
      email: userData.email,
      role: userData.role,
    };
    await db
      .update(user)
      .set(editedUser)
      .where(eq(user.id, Number(userData.id)));
    return JSON.stringify({ success: false, token: "Invalid Token" });
  } catch (error) {
    console.error(error);
    return JSON.stringify({ success: false, message: "Please Try Again." });
  }
};
