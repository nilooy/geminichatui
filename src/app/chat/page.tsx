"use client";
import React, { memo, useEffect, useState } from "react";
import { ChatController } from "@/lib/chats/controller";
import { FolderController } from "@/lib/folders/controller";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { useRouter } from "next/navigation";
import { useEffectOnce } from "usehooks-ts";

const Page = () => {
  const database = useDatabase();
  const [loading, setLoading] = useState(false);
  const chatController = new ChatController(database);
  const folderController = new FolderController(database);
  const { push } = useRouter();

  useEffectOnce(() => {
    const getDefaultChat = async () => {
      setLoading(true);
      let defaultChatId = "";
      const defaultFolder =
        await folderController.createDefaultFolderIfNotExists();
      const chats = await defaultFolder.chats.fetch();
      console.log({ loading });

      if (!chats?.length) {
        const defaultChat = await chatController.createChat(
          "New Chat",
          defaultFolder
        );
        defaultChatId = defaultChat.id;
      } else {
        defaultChatId = chats[0]?.id;
      }
      push(`/chat/${defaultFolder.id}/${defaultChatId}`);
    };
    getDefaultChat();
  });

  return (
    <div className="text-3xl font-black flex justify-center items-center h-screen">
      <p>Loading</p>
    </div>
  );
};

export default memo(Page);
