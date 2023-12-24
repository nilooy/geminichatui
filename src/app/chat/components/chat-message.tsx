import { formatDistance } from "date-fns";
import { Message } from "ai";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./codeblock";
import { MemoizedReactMarkdown } from "./markdown";
import { Icon } from "@/components/ui/icons";
import Image from "next/image";
import React from "react";

export interface ChatMessageProps {
  message: Message;
  chatbotLogo?: string;
  children?: React.ReactNode;
}

export function ChatMessage({
  message,
  chatbotLogo,
  children,
  ...props
}: ChatMessageProps) {
  const isUser = message.role === "user";
  return (
    <div
      className={cn("relative flex flex-col gap-1 w-full items-stretch")}
      {...props}
    >
      <div
        className={cn({
          "self-end": isUser,
        })}
      >
        {isUser ? (
          <span className="text-sm">You</span>
        ) : (
          <div className="p-1 bg-primary/10 border-primary border inline-flex rounded-full shadow-2xl">
            <Icon icon="bi:gem" className="text-lg" />
          </div>
        )}
      </div>
      <div
        className={cn("overflow-auto", {
          "text-right": isUser,
        })}
      >
        {children ? (
          <div
            className={cn(
              "w-auto min-w-0 max-w-full text-2xl prose prose-sm break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 px-4 py-2 inline-block rounded-xl rounded-tl-none bg-secondary",
              {
                "rounded-tr-none bg-primary text-primary prose-invert": isUser,
                "rounded-tl-none bg-secondary": !isUser,
              }
            )}
          >
            {children}
          </div>
        ) : (
          <MemoizedReactMarkdown
            className={cn(
              "w-auto min-w-0 max-w-full text-md prose prose-sm break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 px-4 py-2 inline-block rounded-xl",
              {
                "rounded-tr-none border border-primary/80 prose-invert": isUser,
                "rounded-tl-none bg-secondary": !isUser,
              }
            )}
            remarkPlugins={[remarkGfm, remarkMath]}
            components={{
              p({ children }) {
                return <p className="mb-2 last:mb-0">{children}</p>;
              },
              code({ node, inline, className, children, ...props }) {
                if (children.length) {
                  if (children[0] == "▍") {
                    return (
                      <span className="mt-1 cursor-default animate-pulse">
                        ▍
                      </span>
                    );
                  }

                  children[0] = (children[0] as string).replace("`▍`", "▍");
                }

                const match = /language-(\w+)/.exec(className || "");

                if (inline) {
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }

                return (
                  <CodeBlock
                    key={Math.random()}
                    language={(match && match[1]) || ""}
                    value={String(children).replace(/\n$/, "")}
                    {...props}
                  />
                );
              },
            }}
          >
            {message.content}
          </MemoizedReactMarkdown>
        )}
      </div>
      {!!message.createdAt && (
        <small
          className={cn("opacity-70 text-[10px]", {
            "self-end": isUser,
          })}
        >
          {formatDistance(message.createdAt, new Date(), {
            addSuffix: true,
          })}
        </small>
      )}
    </div>
  );
}
