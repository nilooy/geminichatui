import React from "react";
import ChatUi from "@/app/chat/components";

const ChatIdPage = () => {
  return (
    <div
      className={
        "h-full min-h-[400px] flex justify-center flex-col items-center border overflow-hidden m-auto bg-background w-full bg-muted"
      }
    >
      <ChatUi
        user_id={"asdasd"}
        welcome_message={"hello,👋 how can i help?"}
        className="flex-1 min-h-0 max-w-3xl"
        suggested_message={[
          "How to make good habits?",
          "Where i can go this summer?",
          "Code me react sign up screen",
        ]}
      />
    </div>
  );
};

export default ChatIdPage;
