"use client";
import React, { memo } from "react";
import { ChatController } from "@/lib/chats/controller";
import { FolderController } from "@/lib/folders/controller";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { useRouter } from "next/navigation";
import { useEffectOnce } from "usehooks-ts";
import LoadingDots from "@/components/ui/loading-dots";
import Logo from "@/components/logo";
import LoadingScreen from "@/components/loading-screen";

const Page = () => {
  const database = useDatabase();
  const chatController = new ChatController(database);
  const folderController = new FolderController(database);
  const { push } = useRouter();

  useEffectOnce(() => {
    const getDefaultChat = async () => {
      let defaultChatId = "";
      const defaultFolder =
        await folderController.createDefaultFolderIfNotExists();
      const chats = await defaultFolder.chats.fetch();
      if (!chats?.length) {
        const defaultChat = await chatController.createChat(
          "Untitled Chat",
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

  return <LoadingScreen />;
};

export default memo(Page);
