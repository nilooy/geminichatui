import React from "react";
import { cn } from "@/lib/utils";
import ChatAddFolder from "@/app/chat/components/chat-layout/chat-add-folder";
import AddChat from "@/app/chat/components/chat-layout/chat-add-chat";

const ChatNavHeader = () => {
  return (
    <div className="flex justify-around items-center">
      <div className={cn("flex h-[52px] items-center justify-center")}>
        ChatGemini
      </div>

      <div>
        <ChatAddFolder />
        <AddChat />
      </div>
    </div>
  );
};

export default ChatNavHeader;
