import { relations } from "drizzle-orm";
import {
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

export const rolesEnum = pgEnum("popularity", [
  "C",
  "CR",
  "CRU",
  "CRUD",
  "R",
  "RU",
  "RD",
  "U",
  "UD",
  "D",
]);

export const user = pgTable(
  "user",
  {
    id: serial("id").primaryKey(),
    name: text("name"),
    email: text("email"),
    role: rolesEnum("role"),
    organizationId: integer("organization_id"),
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
