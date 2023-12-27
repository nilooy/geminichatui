import { formatDistance } from "date-fns";
import { Message } from "ai";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./codeblock";
import { MemoizedReactMarkdown } from "./markdown";
import { Icon } from "@/components/ui/icons";
import React from "react";
import CopyButton from "@/components/ui/copy-button";

export interface ChatMessageProps {
  message: Message;
  children?: React.ReactNode;
}

const AnimateText = ({ text, cursor }) => (
  // TODO: <TypeAnimation cursor={cursor} sequence={[text]} speed={99} repeat={false} />
  <p className="relative before:absolute before:inset-0 before:animate-typewriter">
    {text}
  </p>
);

export function ChatMessage({
  message,
  children,
  responseIsStarted,
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
                return (
                  <div className={"mb-2 last:mb-0"}>
                    {isUser ? (
                      <p>{children}</p>
                    ) : (
                      <AnimateText
                        cursor={!!responseIsStarted}
                        text={children}
                      ></AnimateText>
                    )}
                  </div>
                );
              },
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");

                if (inline || !match) {
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
      <div className="flex gap-2 items-center">
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
        <CopyButton text={message.content} />
      </div>
    </div>
  );
}
