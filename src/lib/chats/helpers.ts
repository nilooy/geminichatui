import {
  ChatMessage,
  GeminiChatCompletionRequestMessage,
  GeminiChatRole,
} from "@/lib/chats/types";
import { Conversation } from "@/db/types";

export const convesationLogToMessages = (
  conv: Pick<Conversation, "speaker" | "entry">[] | null
): GeminiChatCompletionRequestMessage[] =>
  (conv || []).map((entry) => ({
    role: entry.speaker,
    parts: entry.entry,
  })) as GeminiChatCompletionRequestMessage[];

export const convesationLogToInitialMessages = (
  conv: Conversation[] | null,
  welcomeMessage?: string
) => {
  const msgs = welcomeMessage
    ? [
        {
          id: "welcome",
          role: GeminiChatRole.WELCOME,
          content: welcomeMessage,
        },
      ]
    : [];

  return [
    ...msgs,
    ...((conv || []).map((entry) => ({
      id: entry.id,
      createdAt: entry.createdAt ? new Date(entry.createdAt) : undefined,
      role: entry.role,
      content: entry.content,
    })) as ChatMessage[]),
  ];
};

export const truncateText = (
  inputText: string,
  maxLength: number = 20
): string => {
  if (inputText?.length <= maxLength) {
    return inputText;
  }
  return `${inputText?.substr(0, maxLength - 3)}...`;
};
