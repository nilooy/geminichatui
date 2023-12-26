export enum GeminiChatRole {
  USER = "user",
  ASSISTANT = "assistant",
  WELCOME = "welcome",
}

export enum ChatType {
  TEXT = "text",
  IMAGE = "image",
}

export interface GeminiChatCompletionRequestMessage {
  role: GeminiChatRole;
  parts: string;
}

export type ChatMessage = {
  id: string;
  createdAt?: Date;
  content: string;
  role: GeminiChatRole;
  type: ChatType;
  name?: string;
};
