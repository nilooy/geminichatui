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
import React, { useState } from "react";
import LoadingDots from "@/components/ui/loading-dots";
import { useDatabase } from "@nozbe/watermelondb/react";
import { ChatController } from "@/lib/chats/controller";
import { useRouter } from "next/navigation";

const ChatDeleteModal = React.forwardRef<HTMLButtonElement>(({ chat }, ref) => {
  const [open, setOpen] = useState(false);
  const database = useDatabase();
  const chatController = new ChatController(database);

  const [isLoading, setLoading] = useState(false);
  const { push } = useRouter();

  const removeChat = async () => {
    setLoading(true);
    try {
      await chatController.deleteChat(chat.id);
      setOpen(false);
      push(`/chat`);
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
        <span className="text-sm ">Remove Chat</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        {isLoading ? (
          <>
            <AlertDialogTitle>Deleting the chat {chat.name}</AlertDialogTitle>
            <div>
              <LoadingDots className="bg-gray-500" />
            </div>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <div>
                This action cannot be undone. This will permanently delete your
                chat and all the conversations and can&apos;t be recovered.
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className={buttonVariants({ variant: "destructive" })}
                onClick={removeChat}
              >
                Delete anyway
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
});

ChatDeleteModal.displayName = "ChatDeleteModal";

export default ChatDeleteModal;
