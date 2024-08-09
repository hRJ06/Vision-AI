import { GoogleGenerativeAI } from "@google/generative-ai";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import otpGenerator from "otp-generator";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* HANDLER TO CHECK WHETHER RESPONSE CONTAINS A HYPERLINK */
export const containsLink = (text: string): boolean => {
  const urlPattern =
    /https?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+/;
  return urlPattern.test(text);
};

/* GENERATE DATABASE VISUALIZATION PROMPT */
export const generate_database_visualisation_prompt = (
  llmResponse: string
): string => {
  return `You are a senior data analyst. I will provide a response from a SQL query. If the data can be effectively represented in a chart (such as a bar chart, pie chart for textual data, etc.), generate a QuickChart link using this data and send me the link only. If the data is insufficient to create a chart, simply respond with "not possible." Do not include any color parameters in the chart. The data prompt is provided by another LLM model. Here is the prompt: ${llmResponse}.`;
};

/* GENERATE MERMAID CODE PROMPT */
export const generate_mermaid_code_prompt = (
  searchTerm: string,
  diagramType: string
): string => {
  return `Please generate Mermaid.js code for a ${searchTerm} diagram of type ${diagramType}. Ensure the diagram is advanced and visually appealing. Provide only the code, starting from and ending at the appropriate points.`;
};

/* GENERATE REDIS CACHE CHECK PROMPT */
export const generate_redis_cache_check_prompt = (
  user_prompt: string,
  prompt: string
): string => {
  return `I will give you two sentences. Simply respond with YES or NO based on whether they convey the same meaning, without matching the words exactly. The first sentence is: "${user_prompt}". The second sentence is: "${prompt}".`;
};

/* CONFIGURATION FOR GENERATIVE MODEL */
export const getModel = () => {
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
  const genAI = new GoogleGenerativeAI(`${API_KEY}`);
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

/* OTP GENERATOR */
export function generateOTP() {
  const otp = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    digits: true,
  });
  return Number(otp);
}

/* OTP EXPIRATION GENERATOR */
export function getOTPExpiration() {
  return new Date(Date.now() + 30 * 60000).toISOString();
}

/* CONSTANTS */
export const INVALID_RESPONSE_SET = new Set(["FALSE"]);
export const AI_MESSAGE_ROLE_SET = new Set(["AI"]);
export const YOU_MESSAGE_ROLE_SET = new Set(["You"]);
export const ENTER_KEY_PRESS_SET = new Set(["Enter"]);
export const CACHE_RESPONSE_SET = new Set(["YES"]);
export const FORM_TYPE_SET = new Set(["Login"]);

/* ENUM FOR DIAGRAM TYPES */
export enum DiagramType {
  ERDiagram = "er-diagram",
  SequenceDiagram = "sequence-diagram",
  ClassDiagram = "class-diagram",
  StateDiagram = "state-diagram",
}

/* DIAGRAM TYPE LABELS */
export const diagramTypeLabels: { [key in DiagramType]: string } = {
  [DiagramType.ERDiagram]: "ER Diagram",
  [DiagramType.SequenceDiagram]: "Sequence Diagram",
  [DiagramType.ClassDiagram]: "Class Diagram",
  [DiagramType.StateDiagram]: "State Diagram",
};

/* RESEND CONFIGURATION */
export const RESEND_SENDER = "noreply@vision.ai <noreply@vision-ai.in>";
export const RESEND_SUBJECT = "Thank You For Choosing Vision AI";

/* REDIS CONFIGURATION */
export const REDIS_EXPIRATION_TIME = 7200;
