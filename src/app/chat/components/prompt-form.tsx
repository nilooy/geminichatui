import { UseChatHelpers } from "ai/react";
import * as React from "react";
import Textarea from "react-textarea-autosize";

import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icons";
import LoadingDots from "@/components/ui/loading-dots";
import { TypeAnimation } from "react-type-animation";

export interface PromptProps
  extends Pick<UseChatHelpers, "input" | "setInput"> {
  onSubmit: (value: string) => Promise<void>;
  isLoading: boolean;
}

export function PromptForm({
  onSubmit,
  input,
  setInput,
  isLoading,
  responseIsStarted,
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = React.useRef<HTMLTextAreaElement>(null as any);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const loading = responseIsStarted || isLoading;

  return (
    <form
      onSubmit={async (e) => {
        const tempInput = input;
        e.preventDefault();
        if (!input?.trim()) {
          return;
        }
        setInput("");
        try {
          await onSubmit(input);
        } catch (e) {
          setInput(tempInput);
          throw e;
        }
      }}
      ref={formRef}
    >
      <div className="p-3">
        <div className="relative flex max-h-60 w-full grow flex-col">
          <Textarea
            ref={inputRef}
            tabIndex={0}
            onKeyDown={onKeyDown}
            disabled={loading}
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            placeholder={loading ? "" : "Ask here"}
            spellCheck={false}
            className="w-full px-4 py-3 resize-none rounded-lg
            border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {loading && (
            <div className="absolute top-0 bottom-0 left-[3px] flex items-center gap-4 ml-4 justify-center">
              <TypeAnimation
                sequence={["Ai is thinking"]}
                speed={40}
                repeat={false}
              />
              <LoadingDots />
            </div>
          )}
          <div className="absolute top-0 bottom-0 right-[3px] flex flex-col justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="submit"
                  size="icon"
                  disabled={isLoading || input === ""}
                >
                  <Icon
                    icon={"ant-design:send-outlined"}
                    className={cn("text-lg text-primary", {
                      "text-gray-400": isLoading || input === "",
                    })}
                  >
                    <span className="sr-only">Click to send Message</span>
                  </Icon>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </form>
  );
}
