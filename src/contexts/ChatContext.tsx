import React, { useState } from 'react';
import { db } from '../firebase/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { ChatContext, type Chat } from './ChatContextValue';

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);

  const fetchChats = (leadId: string) => {
    const q = query(collection(db, 'chats'), orderBy('timestamp', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const chatList: Chat[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.leadId === leadId) {
          chatList.push({ id: doc.id, ...data } as Chat);
        }
      });
      setChats(chatList);
    });
  };

  const addChat = async (chat: Omit<Chat, 'id' | 'timestamp'>) => {
    await addDoc(collection(db, 'chats'), {
      ...chat,
      timestamp: new Date()
    });
  };

  const updateChat = async (id: string, message: string) => {
    await updateDoc(doc(db, 'chats', id), { message });
  };

  const deleteChat = async (id: string) => {
    await deleteDoc(doc(db, 'chats', id));
  };

  return (
    <ChatContext.Provider value={{ chats, fetchChats, addChat, updateChat, deleteChat }}>
      {children}
    </ChatContext.Provider>
  );
};
