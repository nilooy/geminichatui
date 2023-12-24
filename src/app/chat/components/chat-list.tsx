import { type Message } from "ai";
import { ChatMessage } from "./chat-message";

export interface ChatList {
  messages: Message[];
  chatbotLogo?: string;
}

export function ChatList({ messages, chatbotLogo }: ChatList) {
  if (!messages.length) {
    return null;
  }

  return messages
    .filter(
      (message) => message.role !== "function" && message.role !== "system",
    )
    .map((message, index) => (
      <div key={index}>
        <ChatMessage chatbotLogo={chatbotLogo} message={message} />
      </div>
    ));
}
