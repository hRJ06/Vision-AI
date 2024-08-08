import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
const sql = neon(process.env.DATABASE_URI!);
const db = drizzle(sql);
export default db;
