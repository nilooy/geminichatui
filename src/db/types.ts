// Interfaces for Folder and Conversation
export interface Conversation {
  createdAt: Date;
  type: string;
  role: string;
  content: string;
}

export interface Folder {
  createdAt: Date;
  name: string;
  icon: any; // Using 'any' for icon type, replace it with the correct type
  conversations: Conversation[];
}
