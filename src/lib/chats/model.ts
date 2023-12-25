import {
  date,
  readonly,
  text,
  field,
  children,
  relation,
} from "@nozbe/watermelondb/decorators";
import { Model } from "@nozbe/watermelondb";
import { TABLE_NAME } from "@/db/constants";

export class Chats extends Model {
  static table = TABLE_NAME.CHATS;

  @readonly @date("created_at") createdAt!: Date;
  @text("name") name;
  @text("folder_id") folderId;

  @relation(TABLE_NAME.FOLDERS, "folder_id") folder;

  static associations = {
    [TABLE_NAME.FOLDERS]: { type: "belongs_to", key: "folder_id" },
    [TABLE_NAME.CONVERSATIONS]: { type: "has_many", foreignKey: "chat_id" },
  };

  @children("conversations") conversations;
}
