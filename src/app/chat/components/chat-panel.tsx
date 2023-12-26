import { type UseChatHelpers } from "ai/react";

import { PromptForm } from "./prompt-form";
import { ChatType, GeminiChatRole } from "@/lib/chats/types";
import { ConversationController } from "@/lib/conversations/controller";
import { useDatabase } from "@nozbe/watermelondb/react";

export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    | "append"
    | "isLoading"
    | "reload"
    | "messages"
    | "stop"
    | "input"
    | "setInput"
  > {
  id?: string;
  chatArea: React.MutableRefObject<HTMLDivElement | null>;
}

export function ChatPanel({
  chat_id,
  isLoading,
  responseIsStarted,
  stop,
  append,
  reload,
  input,
  setInput,
  messages,
  chatArea,
}: ChatPanelProps) {
  const database = useDatabase();
  const conversationController = new ConversationController(database);

  return (
    <div>
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <PromptForm
          responseIsStarted={responseIsStarted}
          onSubmit={async (value) => {
            await conversationController.createConversation(
              chat_id,
              ChatType.TEXT,
              GeminiChatRole.USER,
              value
            );
            await append({
              content: value,
              role: "user",
            });
          }}
          input={input}
          setInput={setInput}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
