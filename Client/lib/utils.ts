import { GoogleGenerativeAI } from "@google/generative-ai";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ChartConfig } from "@/components/ui/chart";

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

/* GENERATE JSON FORMATTER PROMPT */
export const generate_JSON_prompt = (prompt: string): string => {
  return `I will provide a JSON message. Please correct it to the proper format and return only the final JSON output, nothing else. The message is ${prompt}.`;
};

/* CONFIGURATION FOR GENERATIVE MODEL */
export const getModel = () => {
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
  const genAI = new GoogleGenerativeAI(`${API_KEY}`);
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

/* OTP GENERATOR */
export function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000);
}

/* OTP EXPIRATION GENERATOR */
export function getOTPExpiration() {
  return new Date(Date.now() + 2 * 60000).toISOString();
}

/* COOKIE EXPIRATION GENERATOR */
export function getCookieExpiration() {
  return new Date(Date.now() + 5 * 60 * 60 * 1000);
}
/* RGB GENERATOR */
export function getRGB() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

/* GREY CODE GENERATOR */
export function getGrayCode(count: number): string[] {
  const step = Math.floor(254 / count);
  const shades = [];
  for (let i = 0; i < count; i++) {
    const grayValue = Math.min(254, step * i);
    shades.push(`rgb(${grayValue}, ${grayValue}, ${grayValue})`);
  }
  return shades;
}

/* DATA ARRAY GENERATOR */
export function convertToDataArray(
  input: Array<Record<string, any>>
): Array<Record<string, any>> {
  return input.map((item) => {
    const keys = Object.keys(item);
    const formattedItem: Record<string, any> = {};
    formattedItem[keys[0]] = item[keys[0]];
    formattedItem[keys[1]] = String(item[keys[1]]);
    return formattedItem;
  });
}

/* CHART CONFIG GENERATOR */
export function generateChartConfig(
  data: Array<Record<string, string>>
): ChartConfig {
  if (!data.length) return {};
  const keys = Object.keys(data[0]);
  const chartConfig: ChartConfig = {};
  keys.forEach((key) => {
    chartConfig[key] = { label: key.charAt(0).toUpperCase() + key.slice(1) };
  });
  return chartConfig;
}

/* GENERATE LINE CHART DATA */
export const generateLineChartData = (
  data: Array<Record<string, string>>
): Array<Record<string, string>> => {
  return data.map((item: Record<string, string>) => {
    const keys = Object.keys(item);
    return {
      [keys[0]]: item[keys[0]],
      desktop: item[keys[1]],
    };
  });
};

/* SVG DOWNLOAD HANDLER */
export const downloadSVGDiagram = (className: string, name: string) => {
  const svgElement = document.querySelector(`.${className}`) as SVGElement;
  if (svgElement) {
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${name}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  }
};

/* CONSTANTS */
export const INVALID_RESPONSE_SET = new Set(["FALSE"]);
export const AI_MESSAGE_ROLE_SET = new Set(["AI"]);
export const YOU_MESSAGE_ROLE_SET = new Set(["You"]);
export const ENTER_KEY_PRESS_SET = new Set(["Enter"]);
export const CACHE_RESPONSE_SET = new Set(["YES"]);
export const FORM_TYPE_SET = new Set(["Login"]);
export const DISABLED_TYPE_SET = new Set(["Line", "Area", ""]);

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
export const RESEND_CONTACT_SUBJECT = "Thank You For Choosing Vision AI";
export const RESEND_OTP_SUBJECT = "Please get your Access Token";

/* REDIS CONFIGURATION */
export const REDIS_EXPIRATION_TIME = 7200;
