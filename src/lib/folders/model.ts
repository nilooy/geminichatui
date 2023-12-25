import { date, readonly, text, children } from "@nozbe/watermelondb/decorators";
import { Model } from "@nozbe/watermelondb";
import { TABLE_NAME } from "@/db/constants";

export class Folders extends Model {
  static table = TABLE_NAME.FOLDERS;

  @readonly @date("created_at") createdAt!: Date;
  @text("name") name;
  @text("icon") icon;

  static associations = {
    [TABLE_NAME.CHATS]: { type: "has_many", foreignKey: "folder_id" },
  };

  @children(TABLE_NAME.CHATS) chats;
}
