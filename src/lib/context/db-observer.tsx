import React, { useState, useEffect, useContext, createContext } from "react";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { FolderController } from "@/lib/folders/controller";
import { ChatController } from "@/lib/chats/controller";

export const DbOberserverContext = createContext({});

export const DbOberserverProvider = ({ children }) => {
  const [folders, setFolders] = useState([]);
  const database = useDatabase();
  const folderController = new FolderController(database);

  useEffect(() => {
    const foldersQuery = folderController.getFoldersQuery();

    const foldersSubscription = foldersQuery.observe().subscribe((data) => {
      setFolders(data);
    });

    // Cleanup the subscription
    return () => {
      foldersSubscription.unsubscribe();
    };
  }, [database]);

  return (
    <DbOberserverContext.Provider value={{ folders }}>
      {children}
    </DbOberserverContext.Provider>
  );
};

export const useDbOberserver = () => useContext(DbOberserverContext);
