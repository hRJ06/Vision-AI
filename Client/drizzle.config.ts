import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DATABASE_URI!,
  },
});
