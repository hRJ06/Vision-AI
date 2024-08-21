import { eq } from "drizzle-orm";
import db from "./drizzle";
import { organization, user } from "./schema";

export const getCurrentUser = async (email: string) => {
  return await db.select().from(user).where(eq(user.email, email));
};

export const getCurrentOrganization = async (email: string) => {
  return await db
    .select()
    .from(organization)
    .where(eq(organization.email, email));
};

export const getOrganizationUsers = async (id: number) => {
  return await db.select().from(user).where(eq(user.organizationId, id));
};

export const getUserChats = async (email: string) => {
  return await db.select().from(user).where(eq(user.email, email));
};
