"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useAtBottom } from "@/lib/hooks/use-at-bottom";
import { Button, type ButtonProps } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export function ButtonScrollToBottom({
  className,
  area,
  ...props
}: ButtonProps & { area: React.MutableRefObject<HTMLDivElement | null> }) {
  const isAtBottom = useAtBottom(area);

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "bg-background transition-opacity duration-300",
        isAtBottom ? "opacity-0" : "opacity-100",
        className || ""
      )}
      onClick={() => {
        area?.current?.scrollTo({
          top: area?.current.scrollHeight,
          behavior: "smooth",
        });
      }}
      {...props}
    >
      <ArrowDown />
      <span className="sr-only">Scroll to bottom</span>
    </Button>
  );
}
