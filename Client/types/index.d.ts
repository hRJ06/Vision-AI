export type DiagramType =
  | "er-diagram"
  | "sequence-diagram"
  | "class-diagram"
  | "state-diagram";

export interface ComponentState {
  diagramType: DiagramType;
  searchTerm: string;
  diagramDefinition: string;
  content: boolean;
  loading: boolean;
}

export interface ChatMessage {
  msg: string;
  role: "AI" | "User";
  link?: string | null;
}

export interface DatabaseCredentials {
  Host: string;
  Port: string;
  Database: string;
  User: string;
  Password: string;
}

export interface Message {
  sender: string;
  text: string;
  time?: string;
}

export interface ContactMail {
  name: string;
  email?: string;
  message: string;
}

export interface OTPEmail {
  name: string;
  email: string;
  token: number;
}

export interface FormData {
  name: string;
  email: string;
  message: string;
}

export interface RegisterOrganizationProps {
  name: string;
  email: string;
  password: string;
  lob: string;
  domain: string;
}

export interface LoginOrganizationProps {
  email: string;
  password: string;
}

export interface LoginUserProps {
  email: string;
}

export interface UserProps {
  id?: string;
  token: string;
  name: string;
  email: string;
  role: "Read" | "Write";
}

export interface Employee {
  id: string;
  organizationId?: Number;
  name: string;
  email: string;
  role: "Read" | "Write";
}

export interface VerifyUserProps {
  otp: string;
  email: string;
}

export interface CreateChatParams {
  token: string;
  name: string;
}
/* GEMINI CONFIG */
export type CachedResponse = string | JsonObject;
