// next-app/pages/HomePage.tsx
"use client";

import { useState, useEffect } from 'react';
import React from 'react';

interface HomePageProps {
  selectedChatId?: number;
}

interface Message {
  input: string;
  response: string;
}

const HomePage: React.FC<HomePageProps> = ({ selectedChatId }) => {
  const [userInput, setUserInput] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  // const [selectedChatId, setSelectedChatId] = useState<number | undefined>(1);

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleUserSubmit = async () => {
    if (userInput.trim() !== '') {
      // Send user input to the FastAPI endpoint
      const response = await fetch(`http://localhost:8000/api/chatbot/${encodeURIComponent(userInput)}`);
      const data = await response.json();

      // Update chat history with the chatbot response
      setChatHistory([...chatHistory, { input: userInput, response: data.response }]);

      // Clear user input
      setUserInput('');
    }
  };

  // const handleSelectedChat = (chatId: number) => {
  //   setSelectedChatId(chatId);
  // }

  // const handleCreateNewChat = () => {
  //   const newChatId = Math.floor(Math.random() * 1000000);
  //   setSelectedChatId(newChatId);
  // }

  useEffect(() => {
    // Scroll to the bottom of the chat history whenever it updates
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="flex-grow flex flex-col p-4">
      <div className="flex-grow overflow-y-auto p-4 border rounded" id="chat-container">
        {chatHistory.map((message, index) => (
          <div key={index} className="mb-2">
            <div
              className={`p-2 rounded ${'bg-green-200 self-start text-black'
                }`}
            >
              {message.input}
            </div>
            <div
              className={`p-2 rounded ${'bg-blue-300 self-end text-black'
                }`}
            >
              {message.response}
            </div>
            <br></br>
          </div>
        ))}
      </div>
      <div className="flex mt-4">
        <input
          type="text"
          placeholder="Type your message..."
          value={userInput}
          onChange={handleUserInput}
          className="flex-grow p-2 border rounded mr-2 text-black"
        />
        <button onClick={handleUserSubmit} className="p-2 bg-green-500 text-white rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default HomePage;
