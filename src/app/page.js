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
    "Chat 1": [],
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
    <div className="flex h-full min-h-screen bg-gray-700 text-foreground">
      <Sidebar
        chats={chats}
        setCurrentChat={setCurrentChat}
        createNewChat={createNewChat}
        currentChat={currentChat}
        onConfigure={() => setModalOpen(true)}
      />
      <div className="flex flex-col flex-1">
        <div className="flex-1 overflow-y-auto">
          <ChatWindow messages={chats[currentChat]} />
        </div>
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
