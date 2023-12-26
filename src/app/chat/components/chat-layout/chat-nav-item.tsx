import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Folder } from "@/db/types";
import { ArrowDownWideNarrow, FolderIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useDatabase } from "@nozbe/watermelondb/react";
import { useParams } from "next/navigation";
import { DEFAULT_FOLDER_NAME } from "@/lib/constants";

const ChatNavItem: React.FC<{ folder: Folder }> = ({ folder }) => {
  const [chats, setChats] = useState([]);

  const database = useDatabase();

  useEffect(() => {
    const chatsSubscription = folder.chats.observe().subscribe((data) => {
      if (data?.length) setChats(data);
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

  return (
    <AccordionItem value={folder.id}>
      <AccordianTriggerOrDiv
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
          "justify-between !no-underline w-full"
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
      <AccordionContentOrDiv data-state={"open"}>
        {/* Chats */}
        <div className="flex flex-col gap-1 border-l-4">
          {!!chats?.length &&
            chats.map((chat, idx) => (
              <Link
                key={idx}
                href={`/chat/${chat.folderId}/${chat.id}`}
                className={cn(
                  buttonVariants({
                    variant: chat_id === chat.id ? "default" : "outline",
                    size: "sm",
                  }),
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                  "justify-start"
                )}
              >
                <span className="mr-2 h-4 w-4">{chat.name}</span>
                {/*{conversation.content}*/}
              </Link>
            ))}
        </div>
      </AccordionContentOrDiv>
    </AccordionItem>
  );
};

export default ChatNavItem;
