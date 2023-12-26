import { Folder } from "@/db/types";
import { useDbOberserver } from "@/lib/context/db-observer";
import ChatNavItem from "@/app/chat/components/chat-layout/chat-nav-item";
import { Accordion } from "@/components/ui/accordion";
import { useParams } from "next/navigation";

interface ChatNavProps {
  isCollapsed: boolean;
  folders: Folder[];
}

export function ChatNav({ isCollapsed }: ChatNavProps) {
  const { folders = [] } = useDbOberserver();

  const { folder_id } = useParams();

  return (
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
              <ChatNavItem folder={folder} />
            </Accordion>
          );
        })}
      </nav>
    </div>
  );
}
