import { GoogleGenerativeAI } from "@google/generative-ai";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* HANDLER TO CHECK WHETHER RESPONSE CONTAINS A HYPERLINK */
export const containsLink = (text: string) => {
  const urlPattern =
    /https?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+/;
  return urlPattern.test(text);
};

export const generate_database_visualisation_prompt = (llmResponse: string) : string => {
  return `You are a senior data analyst. I will provide a response from a SQL query. If the data can be effectively represented in a chart (such as a bar chart, pie chart for textual data, etc.), generate a QuickChart link using this data and send me the link only. If the data is insufficient to create a chart, simply respond with "not possible." Do not include any color parameters in the chart. The data prompt is provided by another LLM model. Here is the prompt: ${llmResponse}.`;
};

export const INVALID_RESPONSE_SET = new Set(["FALSE"]);

export const AI_MESSAGE_ROLE_SET = new Set(["AI"])

export const getModel = () => {
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
  const genAI = new GoogleGenerativeAI(`${API_KEY}`);
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};