export enum GeminiChatRole {
  USER = "user",
  MODEL = "model",
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
  name?: string;
};
