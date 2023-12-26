import { Database, Q } from "@nozbe/watermelondb";
import { Chat } from "@/model/Chat";
import { TABLE_NAME } from "@/db/constants";

export class ChatController {
  database: Database;
  chatCollection;

  constructor(database: Database) {
    this.database = database;
    this.chatCollection = this.database.collections.get(TABLE_NAME.CHATS);
  }

  // Create a new chat
  async createChat(name: string, folder?: string) {
    return await this.database.write(async () => {
      return this.chatCollection.create((chat) => {
        chat.name = name;
        chat.folder.set(folder);
      });
    });
  }

  // Read chats
  async getChatsQuery() {
    return this.chatCollection.query();
  }

  // Read chats
  async getChats() {
    return this.getChatsQuery();
  }

  // Update a chat
  async updateChat(chatId: string, newName: string) {
    const chat = await this.chatCollection.find(chatId);
    await this.database.write(async () => {
      await chat.update((chat) => {
        chat.name = newName;
      });
    });
  }

  // Delete a chat
  async deleteChat(chatId: string) {
    const chat = await this.chatCollection.find(chatId);
    await this.database.write(async () => {
      await chat.markAsDeleted(); // soft delete
      // or await chat.destroyPermanently(); for a hard delete
    });
  }
}
