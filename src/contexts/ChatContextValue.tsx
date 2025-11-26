import { createContext } from 'react';

export interface Chat {
  id?: string;
  leadId: string;
  userId: string;
  message: string;
  timestamp: Date;
}

export interface ChatContextType {
  chats: Chat[];
  fetchChats: (leadId: string) => void;
  addChat: (chat: Omit<Chat, 'id' | 'timestamp'>) => Promise<void>;
  updateChat: (id: string, message: string) => Promise<void>;
  deleteChat: (id: string) => Promise<void>;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);
