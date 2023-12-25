import { date, readonly, text } from "@nozbe/watermelondb/decorators";
import { Model } from "@nozbe/watermelondb";
import { TABLE_NAME } from "@/db/constants";

export class Conversations extends Model {
  static table = TABLE_NAME.CONVERSATIONS;

  @readonly @date("created_at") createdAt!: Date;

  static associations = {
    [TABLE_NAME.CHATS]: { type: "belongs_to", key: "chat_id" },
  };

  @text("type") type;
  @text("role") role;
  @text("content") content;
  @text("chat_id") chatId;
}
