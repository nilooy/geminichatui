// model/schema.js
import { appSchema, tableSchema } from "@nozbe/watermelondb";
import { TABLE_NAME } from "@/db/constants";

/*
create table "public"."conversations" (
    "id" uuid not null default gen_random_uuid(),
    "type" text,
    "role" text,
    "content" text,
    "user_id" uuid,
    "created_at" timestamp with time zone not null default now(),
    "folder_id" uuid
);
create table "public"."folders" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "icon" text,
    "user_id" uuid,
    "created_at" timestamp with time zone not null default now()
);
 */

const AppSchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: TABLE_NAME.FOLDERS,
      columns: [
        { name: "name", type: "string" },
        { name: "icon", type: "string", isOptional: true },
        { name: "created_at", type: "number" },
      ],
    }),
    tableSchema({
      name: TABLE_NAME.CHATS,
      columns: [
        { name: "name", type: "string" },
        { name: "folder_id", type: "string", isIndexed: true },
        { name: "created_at", type: "number" },
      ],
    }),
    tableSchema({
      name: TABLE_NAME.CONVERSATIONS,
      columns: [
        { name: "type", type: "string" },
        { name: "role", type: "string" },
        { name: "content", type: "string" },
        { name: "chat_id", type: "string", isIndexed: true },
        { name: "created_at", type: "number" },
      ],
    }),
  ],
});

export default AppSchema;
