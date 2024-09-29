"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import ConfigurationModal from "../components/ConfigurationModal";
import { useChatManager } from "../hooks/useChatManager";

export default function Home() {
  const initialChats = {
    "Chat 1": [
      { role: "assistant", text: "Hello! How can I assist you today?" },
    ],
    "Chat 2": [
      { role: "assistant", text: "Hi! What would you like to talk about?" },
    ],
    "Chat 3": [{ role: "assistant", text: "Good day! Need any help?" }],
  };

  const { chats, currentChat, setCurrentChat, addMessage, createNewChat } =
    useChatManager(initialChats);

  const [isModalOpen, setModalOpen] = useState(false);
  const [config, setConfig] = useState({
    url: process.env.REACT_APP_API_URL,
    model: process.env.REACT_APP_MODEL,
    apiKey: process.env.REACT_APP_API_KEY,
    systemPrompt: process.env.REACT_APP_SYSTEM_PROMPT,
  });

  const handleSaveConfig = (newConfig) => {
    setConfig(newConfig);
  };

  useEffect(() => {
    if (!config.url || !config.model || !config.apiKey) {
      setModalOpen(true);
    }
  }, [config]);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar
        chats={chats}
        setCurrentChat={setCurrentChat}
        createNewChat={createNewChat}
        currentChat={currentChat}
        onConfigure={() => setModalOpen(true)} // Option to open modal manually
      />
      <div className="flex flex-col flex-1">
        <ChatWindow messages={chats[currentChat]} />
        <ChatInput addMessage={addMessage} />
      </div>
      <ConfigurationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveConfig}
      />
    </div>
  );
}
