import { relations } from "drizzle-orm";
import {
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";
export const organization = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  password: text("password"),
  domain: text("domain"),
  lob: text("lob"),
});

export const rolesEnum = pgEnum("popularity", ["Read", "Write"]);

export const user = pgTable(
  "user",
  {
    id: serial("id").primaryKey(),
    name: text("name"),
    email: text("email").notNull(),
    role: rolesEnum("role"),
    otp: integer("otp"),
    expiresIn: date("expires_in"),
    organizationId: integer("organization_id"),
    chats: text("chats").array(),
  },
  (table) => {
    return { emailIdx: uniqueIndex("email_idx").on(table.email) };
  }
);

export const organizationRelations = relations(organization, ({ many }) => ({
  user: many(user),
}));

export const userRelations = relations(user, ({ one }) => ({
  organization: one(organization, {
    fields: [user.organizationId],
    references: [organization.id],
  }),
}));
