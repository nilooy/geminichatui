import { Database, Q } from "@nozbe/watermelondb";
import { Conversations } from "@/model/Conversations";

export class ConversationController {
  private database: Database;
  private conversationCollection;

  constructor(database: Database) {
    this.database = database;
    this.conversationCollection =
      this.database.collections.get<Conversations>("conversations");
  }

  // Create a new conversation
  async createConversation(
    chatId: string,
    type: string,
    role: string,
    content: string
  ): Promise<Conversations> {
    return await this.database.write(async () => {
      return await this.conversationCollection.create((conversation) => {
        conversation.chatId = chatId;
        conversation.type = type;
        conversation.role = role;
        conversation.content = content;
      });
    });
  }

  // Read conversations for a chat
  async getConversationsByChat(chatId: string): Promise<Conversations[]> {
    return await this.conversationCollection
      .query(Q.where("chat_id", chatId), Q.sortBy("created_at"))
      .fetch();
  }

  // Update a conversation
  async updateConversation(
    conversationId: string,
    newContent: string
  ): Promise<void> {
    const conversation = await this.conversationCollection.find(conversationId);
    await this.database.write(async () => {
      await conversation.update((conversation) => {
        conversation.content = newContent;
      });
    });
  }

  // Delete a conversation
  async deleteConversation(conversationId: string): Promise<void> {
    const conversation = await this.conversationCollection.find(conversationId);
    await this.database.write(async () => {
      await conversation.markAsDeleted(); // soft delete
      // or await conversation.destroyPermanently(); for a hard delete
    });
  }
}
