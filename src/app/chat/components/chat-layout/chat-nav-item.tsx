import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Folder } from "@/db/types";
import { ArrowDownWideNarrow, FolderIcon, GripVertical } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useDatabase } from "@nozbe/watermelondb/react";
import { useParams } from "next/navigation";
import { DEFAULT_FOLDER_NAME } from "@/lib/constants";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { ConversationController } from "@/lib/conversations/controller";
import { truncateText } from "@/lib/chats/helpers";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import ChatDeleteModal from "@/app/chat/components/chat-layout/chat-delete";
import FolderDeleteModal from "@/app/chat/components/chat-layout/folder-delete";

const ChatLink = ({ chat, currentChatId, database }) => {
  const {
    attributes,
    listeners,
    setNodeRef: setNodeRefDrag,
    transform,
  } = useDraggable({
    id: chat.id,
  });
  const dropStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 99999,
        opacity: 0.9,
      }
    : undefined;

  const [lastConv, setLastConv] = useState("");
  const conversationController = new ConversationController(database);

  useEffect(() => {
    const getLastConv = async () => {
      const res = await conversationController.getLastConversationsByChat(
        chat.id
      );

      if (res?.content) setLastConv(res.content);
    };

    getLastConv();
  }, [database, chat]);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={cn(
            buttonVariants({
              variant: currentChatId === chat.id ? "default" : "outline",
              size: "lg",
            }),
            "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
            "justify-start w-full border px-2"
          )}
          ref={setNodeRefDrag}
          style={dropStyle}
        >
          <button {...listeners} {...attributes}>
            <GripVertical className="w-4 h-4 mr-2" />
          </button>
          <Link
            href={`/chat/${chat.folderId}/${chat.id}`}
            className="flex-1 flex flex-col"
          >
            <span className="mr-2 h-4 w-4">{truncateText(chat.name, 16)}</span>
            <small>{truncateText(lastConv, 20)}</small>
          </Link>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem asChild>
          <ChatDeleteModal chat={chat} />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

const ChatNavItem: React.FC<{ folder: Folder; activeId: string }> = ({
  folder,
  activeId,
}) => {
  const [chats, setChats] = useState([]);

  const database = useDatabase();

  useEffect(() => {
    const chatsSubscription = folder.chats.observe().subscribe((data) => {
      setChats(data);
    });

    // Cleanup the subscription
    return () => {
      chatsSubscription.unsubscribe();
    };
  }, [database]);

  const { chat_id } = useParams();

  const defaultFolder = folder.name === DEFAULT_FOLDER_NAME;

  const AccordianTriggerOrDiv = defaultFolder ? "div" : AccordionTrigger;
  const AccordionContentOrDiv = defaultFolder ? "div" : AccordionContent;

  const { isOver, setNodeRef } = useDroppable({
    id: folder.id,
    data: folder,
  });

  return (
    <AccordionItem
      value={folder.id}
      ref={setNodeRef}
      className={cn("transition-all", {
        "bg-gray-200": isOver,
      })}
    >
      <ContextMenu>
        <ContextMenuTrigger>
          <AccordianTriggerOrDiv
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
              "justify-between !no-underline w-full flex-start"
            )}
          >
            <div className="flex items-center">
              {defaultFolder ? (
                <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
              ) : (
                <FolderIcon className="h-4 w-4 mr-2" />
              )}
              {folder.name}
            </div>
            <span
              className={cn(
                "ml-auto",
                "bg-primary text-background text-xs px-2 py-1 rounded-md"
              )}
            >
              {chats?.length || 0}
            </span>
          </AccordianTriggerOrDiv>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem asChild>
            <FolderDeleteModal folder={folder} />
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <AccordionContentOrDiv
        data-state={"open"}
        contentwrapperclassname="!overflow-visible"
        className={cn("transition-all", {
          "pb-10": isOver,
        })}
      >
        {/* Chats */}
        <div className="flex flex-col gap-1 border-l-4">
          {!!chats?.length &&
            chats.map((chat, idx) => (
              <ChatLink
                database={database}
                key={idx}
                currentChatId={chat_id}
                chat={chat}
              />
            ))}
          {/*<DragOverlay>*/}
          {/*  {activeId ? (*/}
          {/*    <div className="w-[90%] h-4 bg-primary/30 rounded-sm" />*/}
          {/*  ) : null}*/}
          {/*</DragOverlay>*/}
        </div>
      </AccordionContentOrDiv>
    </AccordionItem>
  );
};

export default ChatNavItem;
