"use client";

import React, { FC } from "react";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps extends React.ComponentProps<"div"> {
  text: string;
  variant?: "ghost" | "default" | "outline";
  size?: "sm" | "lg";
  className?: string;
  showText?: false;
  iconClass?: string;
}
const CopyButton: FC<CopyButtonProps> = ({
  className,
  text,
  variant = "ghost",
  showText = false,
  size = "sm",
  iconClass,
  ...props
}) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });

  const onCopy = () => {
    if (isCopied) return;
    copyToClipboard(text);
  };

  return (
    <Button
      className={cn(className || "")}
      variant={variant as any}
      size={size as any}
      onClick={onCopy}
    >
      {isCopied ? (
        <Check className={cn("w-4 h-4", iconClass || "")} />
      ) : (
        <Copy className={cn("w-4 h-4", iconClass || "")} />
      )}
      <span
        className={cn({
          "sr-only": !showText,
          "ml-1": showText,
        })}
      >
        Copy
      </span>
    </Button>
  );
};

export default CopyButton;
