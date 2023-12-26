"use client";
import { Folder } from "@/db/types";
import { useDbOberserver } from "@/lib/context/db-observer";
import ChatNavItem from "@/app/chat/components/chat-layout/chat-nav-item";
import { Accordion } from "@/components/ui/accordion";
import { useParams } from "next/navigation";
import { DndContext } from "@dnd-kit/core";
import { useState } from "react";
import { ChatController } from "@/lib/chats/controller";
import { useDatabase } from "@nozbe/watermelondb/react";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";

interface ChatNavProps {
  isCollapsed: boolean;
  folders: Folder[];
}

export function ChatNav({ isCollapsed }: ChatNavProps) {
  const [activeId, setActiveId] = useState(null);

  const { folders = [] } = useDbOberserver();
  const database = useDatabase();
  const chatController = new ChatController(database);

  const { folder_id } = useParams();

  return (
    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
      <div
        data-collapsed={isCollapsed}
        className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
      >
        <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
          {folders.map((folder, folderIndex) => {
            return (
              <Accordion
                key={folderIndex}
                defaultValue={folder_id}
                type="single"
                collapsible
              >
                <ChatNavItem activeId={activeId} folder={folder} />
              </Accordion>
            );
          })}
        </nav>
      </div>
    </DndContext>
  );

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  async function handleDragEnd(event) {
    if (event.over && event.over.id) {
      const chatId = event.active?.id;
      const folder = event.over?.data?.current;

      if (chatId && folder) await chatController.moveToFolder(chatId, folder);
    }
  }
}
