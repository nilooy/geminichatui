"use client";
import { TooltipProvider } from "@/components/ui/tooltip";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { Database } from "@nozbe/watermelondb";
import { DatabaseProvider } from "@nozbe/watermelondb/DatabaseProvider";
import { DbOberserverProvider } from "@/lib/context/db-observer";
import LoadingScreen from "@/components/loading-screen";
import Script from "next/script";

const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  const [database, setDatabase] = useState(null);

  useEffect(() => {
    const initDB = async () => {
      const LokiJSAdapter = (
        await import("@nozbe/watermelondb/adapters/lokijs")
      ).default;

      const schema = (await import("@/db/schema")).default;
      const Conversations = (await import("@/lib/conversations/model"))
        .Conversations;
      const Folders = (await import("@/lib/folders/model")).Folders;
      const Chats = (await import("@/lib/chats/model")).Chats;

      // First, create the adapter to the underlying database:
      const adapter = new LokiJSAdapter({
        schema,
        useWebWorker: false,
        useIncrementalIndexedDB: false,
      });

      // Then, make a Watermelon database from it!
      const database = new Database({
        adapter,
        modelClasses: [
          Folders,
          Chats,
          Conversations, // ⬅️ You'll add Models to Watermelon here
        ],
        actionsEnabled: true,
      });

      setDatabase(database);
    };

    initDB();
  }, []);

  const publicUrl =
    process.env.NEXT_PUBLIC_URL && new URL(process.env.NEXT_PUBLIC_URL);

  const plausibleDomain =
    publicUrl &&
    process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_PATH &&
    publicUrl.host;

  return (
    <TooltipProvider>
      {database ? (
        <DatabaseProvider database={database}>
          <DbOberserverProvider>{children}</DbOberserverProvider>
        </DatabaseProvider>
      ) : (
        <LoadingScreen />
      )}
      <Script
        defer
        data-domain={plausibleDomain}
        src={process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_PATH}
      ></Script>
    </TooltipProvider>
  );
};

export default Providers;
