"use client";

import { type Message, useChat } from "ai/react";
import { cn } from "@/lib/utils";
import { ChatList } from "./chat-list";
import { ChatPanel } from "./chat-panel";
import { ChatScrollAnchor } from "./chat-scroll-anchor";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import {
  convesationLogToInitialMessages,
  truncateText,
} from "@/lib/chats/helpers";
import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import LoadingDots from "@/components/ui/loading-dots";
import { ChatMessage } from "./chat-message";
import { toast } from "sonner";
import { ConversationController } from "@/lib/conversations/controller";
import { useDatabase } from "@nozbe/watermelondb/react";
import { ChatType, GeminiChatRole } from "@/lib/chats/types";
import { useParams, useSearchParams } from "next/navigation";

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[];
  conversationId: string;
  id?: string;
  chatContainerClass?: string;
  welcome_message?: string;
  suggested_message?: string[];
  resetOnIncrement?: number;
}

export default function ChatUi({
  id,
  user_id,
  className,
  chatContainerClass,
  welcome_message,
  suggested_message = [],
  conversationId,
}: ChatProps) {
  const chatArea = useRef<HTMLDivElement | null>(null);
  const { chat_id, folder_id } = useParams();

  const [conversations, setConversations] = useState([]);
  const isDataLoading = false;

  const [responseIsStarted, setResponseIsStarted] = React.useState(false);

  const database = useDatabase();
  const conversationController = new ConversationController(database);

  useEffect(() => {
    const getConversations = async () => {
      const data = await conversationController.getConversationsByChat(chat_id);
      if (data?.length) setConversations(data);
    };

    if (database && chat_id) {
      getConversations();
    }
  }, [database, chat_id]);

  const {
    messages = [],
    append,
    reload,
    stop,
    isLoading,
    input,
    setInput,
  } = useChat({
    api: `/chat/${folder_id}/${chat_id}/ai`,
    id: conversationId,
    body: {
      conversation_id: conversationId,
    },
    async onResponse(response) {
      if (response.status !== 200) {
        const data = (await response.json()) as { error?: string };
        toast.error(
          typeof data?.error === "string"
            ? truncateText(data.error, 60)
            : "Something went wrong"
        );
      } else {
        handleSuccessResponse();
      }
    },
    async onFinish(message) {
      setResponseIsStarted(false);
      console.log({ message });
      await saveMessage(message.content);
    },
    onError() {
      setResponseIsStarted(false);
    },
    initialMessages: convesationLogToInitialMessages(
      conversations,
      welcome_message
    ) as Message[],
  });

  const handleSuccessResponse = () => {
    setInput("");
    setResponseIsStarted(true);
  };

  const saveMessage = useCallback(async (message) => {
    await conversationController.createConversation(
      chat_id,
      ChatType.TEXT,
      GeminiChatRole.ASSISTANT,
      message
    );
  }, []);

  // FIXME:
  useEffect(() => {
    chatArea?.current?.scrollTo({
      top: chatArea?.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length, messages.at(-1)?.content.split("\n").length]);

  return (
    <div className={cn("flex flex-col w-full my-auto", className || "")}>
      <Separator className="border" />
      <div className={cn("flex-1 overflow-y-auto p-4")} ref={chatArea}>
        {isDataLoading && (
          <div className="max-w-2xl m-auto flex flex-col gap-6">
            {[1, 2, 3].map((i) => (
              <div className="flex flex-col gap-3" key={i.toString()}>
                <Skeleton className="w-[70%] h-[70px] rounded-2xl self-end" />
                <Skeleton className="w-[70%] h-[70px] rounded-2xl" />
              </div>
            ))}
          </div>
        )}
        {!isDataLoading && !!messages.length && (
          <div
            className={cn("w-full overflow-y-auto", chatContainerClass || "")}
          >
            <ChatList messages={messages} />
            <ChatScrollAnchor area={chatArea} trackVisibility={isLoading} />
          </div>
        )}
        {isLoading && !responseIsStarted && (
          <ChatMessage
            message={{ role: "assistant", content: "", id: "loading" }}
            responseIsStarted={responseIsStarted}
          >
            <LoadingDots className="!w-2 !h-2" />
          </ChatMessage>
        )}
      </div>
      <Skeleton className="w-[70%] h-[70px] rounded-2xl self-end" />
      {!!suggested_message?.length && (
        <div className="w-full overflow-x-auto pt-2 no-scrollbar border-t">
          <div className="flex px-2 justify-start gap-3 flex-nowrap">
            {suggested_message.map((item, idx) => (
              <Button
                variant="outline"
                title="Click to ask this"
                className="text-[10px] px-2 py-1 h-auto rounded-2xl flex-shrink-0"
                key={"suggested_message-" + idx.toString()}
                onClick={async () => {
                  await append({
                    content: item,
                    role: GeminiChatRole.USER,
                  });
                }}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
      )}

      <ChatPanel
        chat_id={chat_id}
        isLoading={isLoading}
        responseIsStarted={responseIsStarted}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
        chatArea={chatArea}
      />
    </div>
  );
}
