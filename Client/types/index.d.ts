export type DiagramType =
  | "er-diagram"
  | "sequence-diagram"
  | "class-diagram"
  | "activity-diagram"
  | "other";

export interface ComponentState {
  diagramType: DiagramType;
  searchTerm: string;
  diagramDefinition: string;
  content: boolean;
  loading: boolean;
}

export interface ChatMessage {
  msg: string;
  role: 'AI' | 'User';
  link?: string | null;
}