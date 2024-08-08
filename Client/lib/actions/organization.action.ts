"use server";
import db from "@/db/drizzle";
import { organization } from "@/db/schema";
import { LoginOrganizationProps, RegisterOrganizationProps } from "@/types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

export const registerOrganization = async (
  organizationData: RegisterOrganizationProps
) => {
  try {
    const user = await db
      .select()
      .from(organization)
      .where(eq(organization.email, organizationData.email));
    if (user.length > 0) {
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
        return JSON.stringify({ success: true, token: token });
      } else {
      }
    } else {
      return { success: false, message: "You are not registered with us." };
    }
  } catch (error) {
    console.error(error);
    return JSON.stringify({ sucess: false });
  }
};
