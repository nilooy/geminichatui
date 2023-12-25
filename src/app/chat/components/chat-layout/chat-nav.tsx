import Link from "next/link";
import { Folder as FolderIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Folder } from "@/db/types";
import { useDbOberserver } from "@/lib/context/db-observer";
import ChatNavItem from "@/app/chat/components/chat-layout/chat-nav-item";

interface ChatNavProps {
  isCollapsed: boolean;
  folders: Folder[];
}

export function ChatNav({ isCollapsed }: ChatNavProps) {
  const { folders = [] } = useDbOberserver();

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {folders.map((folder, folderIndex) => (
          <ChatNavItem key={folderIndex} folder={folder} />
        ))}
      </nav>
    </div>
  );
}
