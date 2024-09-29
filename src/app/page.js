"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import ConfigurationModal from "../components/ConfigurationModal";
import { useChatManager } from "../hooks/useChatManager";
import {
  ConfigurationProvider,
  useConfiguration,
} from "../context/ConfigurationContext";

const HomeContent = () => {
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

  const {
    url,
    model,
    apiKey,
    systemPrompt,
    validateConfig,
    modalOpen,
    setModalOpen,
    loading,
  } = useConfiguration();

  useEffect(() => {
    if (!loading) {
      const checkConfig = async () => {
        const isValid = await validateConfig({
          url,
          model,
          apiKey,
          systemPrompt,
        });
        if (!isValid) {
          setModalOpen(true);
        }
      };

      checkConfig();
    }
  }, [loading, url, model, apiKey, systemPrompt, validateConfig, setModalOpen]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar
        chats={chats}
        setCurrentChat={setCurrentChat}
        createNewChat={createNewChat}
        currentChat={currentChat}
        onConfigure={() => setModalOpen(true)}
      />
      <div className="flex flex-col flex-1">
        <ChatWindow messages={chats[currentChat]} />
        <ChatInput addMessage={addMessage} />
      </div>
      <ConfigurationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default function Home() {
  return (
    <ConfigurationProvider>
      <HomeContent />
    </ConfigurationProvider>
  );
}
