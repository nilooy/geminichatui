import { type UseChatHelpers } from "ai/react";

import { PromptForm } from "./prompt-form";

export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    | "append"
    | "isLoading"
    | "reload"
    | "messages"
    | "stop"
    | "input"
    | "setInput"
  > {
  id?: string;
  chatArea: React.MutableRefObject<HTMLDivElement | null>;
}

export function ChatPanel({
  id,
  isLoading,
  stop,
  append,
  reload,
  input,
  setInput,
  messages,
  chatArea,
}: ChatPanelProps) {
  return (
    <div>
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <PromptForm
          onSubmit={async (value) => {
            await append({
              id,
              content: value,
              role: "user",
            });
          }}
          input={input}
          setInput={setInput}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
