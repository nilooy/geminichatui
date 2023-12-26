import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { FolderController } from "@/lib/folders/controller";
import { useDatabase } from "@nozbe/watermelondb/react";
import { ChatController } from "@/lib/chats/controller";
import { useRouter } from "next/navigation";

const AddChat = () => {
  const [open, setOpen] = useState(false);
  const [chatName, setChatName] = useState("");

  const database = useDatabase();

  const chatController = new ChatController(database);
  const folderController = new FolderController(database);
  const { push } = useRouter();

  const handleAddChat = async (e) => {
    e.preventDefault();
    try {
      const defaultFolder =
        await folderController.createDefaultFolderIfNotExists();

      const chat = await chatController.createChat(
        chatName || "New Chat",
        defaultFolder
      );
      setOpen(false);
      push(`/chat/${defaultFolder.id}/${chat.id}`);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild={true}>
        <Button variant="outline" size="icon" className="rounded-r-none">
          <Plus className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <form onSubmit={handleAddChat}>
          <div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="email">New Chat</Label>
            <div className="flex">
              <Input
                onChange={(e) => setChatName(e.target.value)}
                type="text"
                id="chatName"
                placeholder="Name (Optional) eg. Analyze my resume"
              />
              <Button type="submit">&#9166;</Button>
            </div>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default AddChat;
