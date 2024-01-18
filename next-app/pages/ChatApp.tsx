"use client";
// components/ChatApp.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import HomePage from '../components/HomePage';
import LeftPanel from '../components/LeftPanel';

const ChatApp: React.FC = () => {

  const router = useRouter();

  const [chats, setChats] = React.useState<{ id: number; name: string }[]>([
    { id: 1, name: 'Chat 1' },
    { id: 2, name: 'Chat 2' },
  ]);

  const [selectedChatId, setSelectedChatId] = React.useState<number | undefined>(1);
  // const { selectedChatId } = router.

  const handleSelectChat = (chatId: number) => {
    router.push(`/chat?chatId=${chatId}`);

    setSelectedChatId(chatId);
    // Logic to load chat based on chatId
    // You can fetch chat data or update the chat content here
  };

  const handleCreateNewChat = () => {
    // Generate a random ID for the new chat
    const newChatId = Math.floor(Math.random() * 1000000);
    
    // Create a new chat object
    const newChat = { id: newChatId, name: `Chat ${newChatId}` };

    // Update the list of chats
    setChats([...chats, newChat]);

    // Set the new chat as selected
    setSelectedChatId(newChatId);
    router.push(`/chat?chatId=${newChatId}`);
  };

  return (
    <div className="flex h-screen">
      {/* LeftPanel */}
      <LeftPanel selectedChatId={Number(selectedChatId)} onSelectChat={handleSelectChat} onCreateNewChat={handleCreateNewChat} chats={chats} />

      {/* Chat Container */}
      <HomePage selectedChatId={Number(selectedChatId)} />
    </div>
  );
};

export default ChatApp;
