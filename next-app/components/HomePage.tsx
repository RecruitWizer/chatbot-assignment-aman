// next-app/pages/HomePage.tsx
"use client";

import { useState, useEffect } from 'react';
import React from 'react';
import { useSession, signIn } from 'next-auth/react';
import { addChat, getChat } from '../app/actions/create.js';
import { useChat } from "ai/react";
import { redirect } from 'next/navigation';
// import { ChatInput, ChatMessages } from "./ui/chat";

interface HomePageProps {
  selectedChatId?: number;
}

interface Message {
  input: string;
  response: string;
  timestamp: number;
}

const HomePage: React.FC<HomePageProps> = ({ selectedChatId }) => {
  // const { data: session } = useSession();
  // if (session === null) {
  //   redirect("/login");
  // }
  
  const [userInput, setUserInput] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [responses, setResponses] = useState<string[]>([]);
  // const [selectedChatId, setSelectedChatId] = useState<number | undefined>(1);

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleUserSubmit = async () => {
    if (userInput.trim() !== '') {
      // Send user input to the FastAPI endpoint
      // const response = await fetch(`http://localhost:8000/api/chatbot/${encodeURIComponent(userInput)}`);
      // const data = await response.json();
      // console.log(response);
      
      const response = await fetch(`http://localhost:8000/api/chatbot/${encodeURIComponent(userInput)}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const reader = response.body?.getReader();

      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      let result = '';

      const read = async () => {
        const { done, value } = await reader?.read();

        if (done) {
          return;
        }
        // console.log(new TextDecoder().decode(value));
        const temp = new TextDecoder().decode(value);
        
        result = result + temp;
        // Continue reading the stream
        await read();
      };

      // Start reading the stream
      await read();

      // Update chat history with the chatbot response
      const newMessage = {input: userInput, response: result, timestamp: Date.now()}
      // const newMessage = {input: userInput, response: data.response, timestamp: Date.now()}
      setChatHistory([...chatHistory, newMessage]);

      // Save the new message to Redis
      await addChat(selectedChatId, newMessage);

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
    const fetchChatHistory = async () => {
      if (selectedChatId !== undefined) {
        try {
          const fetchedChatHistory = await getChat(selectedChatId);
          setChatHistory(fetchedChatHistory || []);
        } catch (error) {
          console.error('Error fetching chat history from Redis:', error);
        }
      }
    };
    
    fetchChatHistory();
    
    // Scroll to the bottom of the chat history whenever it updates
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [ selectedChatId]);

  return (
    <div className="flex-grow flex flex-col p-4">
      <div className="flex-grow overflow-y-auto p-4 border rounded" id="chat-container">
        {chatHistory.map((message, index) => (
          <div key={index} className="mb-2">
            <div
              className={`p-2 rounded ${'bg-green-200 self-start dark:text-medium text-black'
                }`}
            >
              {message.input}
            </div>
            <div
              className={`p-2 rounded ${'bg-blue-300 self-end dark:text-medium text-black'
                }`}
            >
            {/* <pre>{message.response}</pre> */}
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
          className="flex-grow p-2 border rounded mr-2 dark:text-white text-black"
        />
        <button onClick={handleUserSubmit} className="p-2 bg-green-500 dark:text-black text-white rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default HomePage;
