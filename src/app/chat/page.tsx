import React from "react";
import ChatUi from "@/app/chat/components";

const Page = () => {
  return (
    <div
      className={
        "h-full min-h-[400px] flex justify-center flex-col items-center border overflow-hidden m-auto bg-background w-full bg-muted"
      }
    >
      <ChatUi
        user_id={"asdasd"}
        welcome_message={"hello how are you?"}
        className="flex-1 min-h-0 max-w-3xl"
      />
    </div>
  );
};

export default Page;