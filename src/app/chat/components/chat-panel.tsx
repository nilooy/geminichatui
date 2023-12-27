import { type UseChatHelpers } from "ai/react";

import { PromptForm } from "./prompt-form";
import { ChatType, GeminiChatRole } from "@/lib/chats/types";
import { ConversationController } from "@/lib/conversations/controller";
import { useDatabase } from "@nozbe/watermelondb/react";
import { Button } from "@/components/ui/button";
import { Redo, Redo2, RedoDot, StopCircle } from "lucide-react";

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
  setResponseIsStarted,
  stop,
  append,
  reload,
  input,
  setInput,
  messages,
  conversations,
  chatArea,
}: ChatPanelProps) {
  const database = useDatabase();
  const conversationController = new ConversationController(database);

  const loading = isLoading || responseIsStarted;

  return (
    <div>
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex justify-center">
          {loading && (
            <Button
              onClick={() => {
                setResponseIsStarted(false);
                return stop();
              }}
              size="sm"
              variant={"outline"}
            >
              <StopCircle className="w-4 h-4 mr-1" />
              Stop
            </Button>
          )}

          {!loading && messages.length > 1 && (
            <Button
              onClick={async () => {
                const conversations =
                  await conversationController.getConversationsByChat(chat_id);
                const lastMsg = conversations[conversations?.length - 1];

                if (lastMsg?.role === GeminiChatRole.ASSISTANT) {
                  await conversationController.deleteConversation(lastMsg.id);
                  return reload();
                }
              }}
              size="sm"
              variant={"outline"}
            >
              <Redo2 className="w-4 h-4 mr-1" />
              Regenerate
            </Button>
          )}
        </div>
        <PromptForm
          responseIsStarted={responseIsStarted}
          onSubmit={async (value) => {
            const conv = await conversationController.createConversation(
              chat_id,
              ChatType.TEXT,
              GeminiChatRole.USER,
              value
            );
            await append({
              content: value,
              role: "user",
              id: conv.id,
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
