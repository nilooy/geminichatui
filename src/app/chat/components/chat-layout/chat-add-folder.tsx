"use client";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Folder } from "@/db/types";
import { FolderUp } from "lucide-react";
import { useDatabase } from "@nozbe/watermelondb/react";
import { FolderController } from "@/lib/folders/controller";

interface ChatAddFolder {
  folders: Folder[];
  addFolder: (folder: Folder) => Promise<void>;
  deleteFolder: (folder: Folder) => Promise<void>;
}

const ChatAddFolder: React.FC<ChatAddFolder> = () => {
  const [open, setOpen] = useState(false);
  const [folderName, setFolderName] = useState("");

  const database = useDatabase();
  const folderController = new FolderController(database);

  const handleAddFolder = async (e) => {
    e.preventDefault();
    if (!folderName) return;

    try {
      await folderController.createFolder(folderName);

      setOpen(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild={true}>
        <Button variant="outline" size="icon" className="rounded-r-none">
          <FolderUp className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <form onSubmit={handleAddFolder}>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Add Folder</Label>
            <div className="flex">
              <Input
                onChange={(e) => setFolderName(e.target.value)}
                type="text"
                id="folder"
                placeholder="eg. Legal Document"
              />
              <Button type="submit">&#9166;</Button>
            </div>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default ChatAddFolder;
