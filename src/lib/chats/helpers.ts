import {
  ChatMessage,
  GeminiChatCompletionRequestMessage,
  GeminiChatRole,
} from "@/lib/chats/types";

export const convesationLogToMessages = (
  conv: Pick<Conversation, "speaker" | "entry">[] | null
): GeminiChatCompletionRequestMessage[] =>
  (conv || []).map((entry) => ({
    role: entry.speaker,
    parts: entry.entry,
  })) as GeminiChatCompletionRequestMessage[];

export const convesationLogToInitialMessages = (
  conv: Pick<Conversation, "speaker" | "entry" | "created_at" | "id">[] | null,
  welcomeMessage?: string
): ChatMessage[] => {
  const msgs = welcomeMessage
    ? [
        {
          id: "welcome",
          role: GeminiChatRole.MODEL,
          content: welcomeMessage,
        },
      ]
    : [];

  return [
    ...msgs,
    ...((conv || []).map((entry) => ({
      id: entry.id,
      createdAt: entry.created_at ? new Date(entry.created_at) : undefined,
      role: entry.speaker,
      content: entry.entry,
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
