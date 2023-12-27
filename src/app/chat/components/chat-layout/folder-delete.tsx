import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import LoadingDots from "@/components/ui/loading-dots";
import { useDatabase } from "@nozbe/watermelondb/react";
import { ChatController } from "@/lib/chats/controller";
import { ConversationController } from "@/lib/conversations/controller";
import { FolderController } from "@/lib/folders/controller";

const FolderDeleteModal = React.forwardRef<HTMLButtonElement>(
  ({ folder }, ref) => {
    const [open, setOpen] = useState(false);
    const database = useDatabase();
    const folderController = new FolderController(database);
    const chatController = new ChatController(database);
    const [chats, setChats] = useState();

    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
      const getChats = async () => {
        const data = await folder.chats.fetch();
        setChats(data);
      };
      getChats();
    }, []);

    const removeFolder = async () => {
      setLoading(true);
      try {
        await folderController.deleteFolder(folder.id);
        setOpen(false);
      } catch (e) {
        console.log({ e });
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 5000);
      }
    };

    return (
      <AlertDialog open={open} onOpenChange={setOpen} ref={ref}>
        <AlertDialogTrigger
          className={`flex items-center px-2 gap-1 text-destructive`}
        >
          <TrashIcon size={16} />
          <span className="text-sm ">Remove Folder</span>
        </AlertDialogTrigger>
        <AlertDialogContent>
          {isLoading ? (
            <>
              <AlertDialogTitle>
                Deleting the folder {folder.name}
              </AlertDialogTitle>
              <div>
                <LoadingDots className="bg-gray-500" />
              </div>
            </>
          ) : (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <div>
                  This action cannot be undone. This will permanently delete
                  your folder and can&apos;t be recovered.
                  {chats?.length ? (
                    <div>
                      <p>This will delete the following chats</p>
                      <ul>
                        {chats.map((chat) => (
                          <li className="text-destructive" key={chat.id}>
                            - {chat.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setOpen(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className={buttonVariants({ variant: "destructive" })}
                  onClick={removeFolder}
                >
                  Delete anyway
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    );
  }
);

FolderDeleteModal.displayName = "FolderDeleteModal";

export default FolderDeleteModal;
