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


CREATE UNIQUE INDEX conversations_pkey ON public.conversations USING btree (id);

CREATE UNIQUE INDEX folders_pkey ON public.folders USING btree (id);

alter table "public"."conversations" add constraint "conversations_pkey" PRIMARY KEY using index "conversations_pkey";

alter table "public"."folders" add constraint "folders_pkey" PRIMARY KEY using index "folders_pkey";

alter table "public"."conversations" add constraint "conversations_folder_id_fkey" FOREIGN KEY (folder_id) REFERENCES folders(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."conversations" validate constraint "conversations_folder_id_fkey";

alter table "public"."conversations" add constraint "conversations_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."conversations" validate constraint "conversations_user_id_fkey";

alter table "public"."folders" add constraint "folders_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."folders" validate constraint "folders_user_id_fkey";


