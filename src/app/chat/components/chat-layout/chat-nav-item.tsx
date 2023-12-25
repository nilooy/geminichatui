import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Folder } from "@/db/types";
import { FolderIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useDatabase } from "@nozbe/watermelondb/react";

const ChatNavItem: React.FC<{ folder: Folder }> = ({ folder }) => {
  const [chats, setChats] = useState([]);

  const database = useDatabase();

  // useEffect(() => {
  //   const getChats = async () => {
  //     const fetchedChats = await folder.chats.fetch();
  //     if (fetchedChats?.length) setChats(fetchedChats);
  //   };
  //   getChats();
  // }, []);

  useEffect(() => {
    const chatsSubscription = folder.chats.observe().subscribe((data) => {
      console.log({ data });
      if (data?.length) setChats(data);
    });

    // Cleanup the subscription
    return () => {
      chatsSubscription.unsubscribe();
    };
  }, [database]);

  console.log({ chats });
  return (
    <div className="flex flex-col">
      {/* Folder UI */}
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
              "justify-between !no-underline"
            )}
          >
            <div className="flex items-center">
              <FolderIcon className="h-4 w-4 mr-2" />
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
          </AccordionTrigger>
          <AccordionContent>
            {/* Chats */}
            <div className="flex flex-col gap-1 border-l-4">
              {!!chats?.length &&
                chats.map((chat, idx) => (
                  <Link
                    key={idx}
                    href="#"
                    className={cn(
                      buttonVariants({ variant: "secondary", size: "sm" }),
                      "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                      "justify-start"
                    )}
                  >
                    <span className="mr-2 h-4 w-4">{chat.name}</span>
                    {/*{conversation.content}*/}
                  </Link>
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ChatNavItem;
