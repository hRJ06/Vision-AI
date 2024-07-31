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
