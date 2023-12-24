"use client";

import { type Message, useChat } from "ai/react";
import { cn } from "@/lib/utils";
import { ChatList } from "./chat-list";
import { ChatPanel } from "./chat-panel";
import { ChatScrollAnchor } from "./chat-scroll-anchor";
import { useEffect, useRef } from "react";
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

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[];
  conversationId: string;
  id?: string;
  chatContainerClass?: string;
  welcome_message?: string;
  suggested_message?: string[];
  chatbotLogo?: string;
  resetOnIncrement?: number;
}

export default function ChatUi({
  id,
  user_id,
  className,
  chatContainerClass,
  welcome_message,
  suggested_message = [],
  chatbotLogo,
  conversationId,
}: ChatProps) {
  const chatArea = useRef<HTMLDivElement | null>(null);

  // const { supabase } = useSupabaseAuth();
  //
  // const { data: conversations = [], isLoading: isDataLoading } = useQuery(
  //   supabase
  //     .from("conversations")
  //     .select()
  //     .eq("id", conversationId || "")
  //     .order("created_at", { ascending: true }),
  //   {
  //     revalidateOnFocus: false,
  //     revalidateOnReconnect: false,
  //   }
  // );
  const conversations = [];
  const isDataLoading = false;

  const [responseIsStarted, setResponseIsStarted] = React.useState(false);

  const {
    messages = [],
    append,
    reload,
    stop,
    isLoading,
    input,
    setInput,
  } = useChat({
    api: "/api/chatbots/message",
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
        setResponseIsStarted(true);
      }
    },
    // onFinish() {},
    initialMessages: convesationLogToInitialMessages(
      conversations,
      welcome_message
    ) as Message[],
  });

  // set response is complete to false when the loading state changes
  useEffect(() => {
    if (!isLoading) {
      setResponseIsStarted(false);
    }
  }, [isLoading]);

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
            <ChatList chatbotLogo={chatbotLogo} messages={messages} />
            <ChatScrollAnchor area={chatArea} trackVisibility={isLoading} />
          </div>
        )}
        {isLoading && !responseIsStarted && (
          <ChatMessage
            message={{ role: "assistant", content: "", id: "loading" }}
          >
            <LoadingDots className="!w-2 !h-2" />
          </ChatMessage>
        )}
      </div>
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
                    id,
                    content: item,
                    role: "user",
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
        id={id}
        isLoading={isLoading}
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
