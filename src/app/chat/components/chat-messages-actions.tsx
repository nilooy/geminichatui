import { type Message } from "ai";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";

interface ChatMessageActionsProps extends React.ComponentProps<"div"> {
  message: Message;
}

export function ChatMessageActions({
  message,
  isUser,
  className,
  ...props
}: ChatMessageActionsProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });

  const onCopy = () => {
    if (isCopied) return;
    copyToClipboard(message.content);
  };

  return (
    <div
      className={cn(
        "absolute right-0 top-0 transition-opacity group-hover:opacity-100 md:absolute md:right-2 md:-top-2 md:opacity-0",
        className || ""
      )}
      {...props}
    >
      {!isUser && (
        <Button
          className="bg-gray-100/90 h-4 w-4"
          variant="ghost"
          size="icon"
          onClick={onCopy}
        >
          {isCopied ? <CheckIcon /> : <CopyIcon />}
          <span className="sr-only">Copy</span>
        </Button>
      )}
    </div>
  );
}
