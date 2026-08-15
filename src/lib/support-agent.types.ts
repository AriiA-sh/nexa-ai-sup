export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  /** Titles of knowledge-base articles used to ground the answer. */
  sources?: string[];
  grounded?: boolean;
  demo?: boolean;
  error?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  messages: ChatMessage[];
}

export interface AgentAnswer {
  answer: string;
  sources: string[];
  grounded: boolean;
  /** True when the answer came from the offline demo engine (no API key). */
  demo: boolean;
  latencyMs: number;
}