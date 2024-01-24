"use client";
// components/LeftPanel.tsx
import React from 'react';
import { signOut } from "next-auth/react";
import ThemeToggle from './ThemeToggle';

interface LeftPanelProps {
  selectedChatId?: number;
  onSelectChat: (chatId: number) => void;
  onCreateNewChat: () => void;
  chats: { id: number; name: string }[];
}

const LeftPanel: React.FC<LeftPanelProps> = ({ selectedChatId, onSelectChat, onCreateNewChat, chats }) => {
  return (
    <div className="flex flex-col h-screen dark:bg-dark bg-white">
      <div className="bg-gray-200 p-4 flex flex-col flex-grow overflow-y-auto">
        <button onClick={onCreateNewChat} className="p-2 bg-green-500 text-white rounded">
          Create New Chat
        </button>
        <br />
        <br />
        <ul>
          {chats.map((chat) => (
            <li
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`cursor-pointer ${selectedChatId === chat.id ? 'font-bold text-black' : ''}`}
            >
              {chat.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-200 p-4 flex flex-col flex-grow overflow-y-auto">
        <button onClick={() => signOut()} className="p-2 bg-blue-500 dark:text-black text-white rounded mt-auto">
          Logout
        </button>
        <br></br>
        <div>
          <ThemeToggle></ThemeToggle>
        </div>
      </div>
    </div>

  );
};

export default LeftPanel;
