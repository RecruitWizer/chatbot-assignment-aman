"use server";

import { client } from "@/lib/db";

export async function getChatIds() {
    try {
        const chatIds = await client.LRANGE('id', 0, -1);
        return chatIds.map(Number);
    } catch (error) {
        console.error('Error fetching chat IDs from Redis:', error);
        return [];
    }
}

export async function addChatId(chatId) {
    try {
        await client.RPUSH('id', chatId.toString());
    } catch (error) {
        console.error('Error adding chat ID to Redis:', error);
    }
}

export async function addChat(chatId, message) {
    try {
        // Fetch the existing chat history from Redis
        const existingChatHistory = await getChat(chatId);

        // Add the new message to the chat history
        const updatedChatHistory = [...existingChatHistory, message];

        // Save the updated chat history back to Redis
        await client.set(`chat:${chatId}`, JSON.stringify(updatedChatHistory));

        return { success: true, message: "Message added to chat history" };
    } catch (error) {
        console.error("Error adding chat message to Redis:", error);
        return { success: false, message: "Failed to add message to chat history" };
    }

}

export async function getChat(chatId) {
    try {
        // Retrieve the chat history from Redis
        const chatHistoryString = await client.get(`chat:${chatId}`);
        const chatHistory = JSON.parse(chatHistoryString) || [];

        return chatHistory;
    } catch (error) {
        console.error("Error fetching chat history from Redis:", error);
        return [];
    }

}

export async function deleteChat(chatId) {
    try {
        // client.connect().then(() => {

        // });
        // Delete the chat history from Redis
        await client.del(`chat:${chatId}`);

        return { success: true, message: "Chat history deleted" };
    } catch (error) {
        console.error("Error deleting chat history from Redis:", error);
        return { success: false, message: "Failed to delete chat history" };
    }

}