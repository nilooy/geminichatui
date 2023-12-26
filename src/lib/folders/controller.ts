import { Database, Q } from "@nozbe/watermelondb";
import { Folders } from "@/model/Folders";
import { DEFAULT_FOLDER_NAME } from "@/lib/constants";
import { TABLE_NAME } from "@/db/constants";

export class FolderController {
  database: Database;
  folderCollection;

  constructor(database: Database) {
    this.database = database;
    this.folderCollection = this.database.collections.get(TABLE_NAME.FOLDERS);
  }

  // Create a new folder
  async createFolder(name: string, icon?: string) {
    // TODO: check duplicate name
    return this.database.write(async () => {
      return await this.folderCollection.create((folder) => {
        folder.name = name;
        folder.icon = icon;
      });
    });
  }

  // Read folders
  getFoldersQuery() {
    return this.folderCollection.query(Q.sortBy("created_at"));
  }

  // Read folders
  async getFolders() {
    return this.getFoldersQuery().fetch();
  }

  async createDefaultFolderIfNotExists() {
    const defaultFolder = await this.folderCollection.query(
      Q.where("name", DEFAULT_FOLDER_NAME)
    );

    console.log({ defaultFolder });

    if (!defaultFolder?.length) return this.createFolder(DEFAULT_FOLDER_NAME);

    return defaultFolder?.[0];
  }

  // Update a folder
  async updateFolder(folderId: string, newName: string, newIcon: string) {
    const folder = await this.folderCollection.find(folderId);
    await this.database.write(async () => {
      await folder.update((folder) => {
        folder.name = newName;
        folder.icon = newIcon;
      });
    });
  }

  // Delete a folder
  async deleteFolder(folderId: string) {
    const folder = await this.folderCollection.find(folderId);
    await this.database.write(async () => {
      await folder.markAsDeleted(); // soft delete
      // or await folder.destroyPermanently(); for a hard delete
    });
  }
}
