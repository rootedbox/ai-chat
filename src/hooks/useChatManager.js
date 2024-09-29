import { useState } from "react";

// Custom hook to manage chat state and logic
export function useChatManager(initialChats) {
  const [chats, setChats] = useState(initialChats);
  const [currentChat, setCurrentChat] = useState("Chat 1");

  const addMessage = (message) => {
    setChats((prevChats) => ({
      ...prevChats,
      [currentChat]: [
        ...prevChats[currentChat],
        { role: "user", text: message },
      ],
    }));
  };

  const createNewChat = () => {
    const newChatName = `Chat ${Object.keys(chats).length + 1}`;
    setChats((prevChats) => ({
      ...prevChats,
      [newChatName]: [{ role: "assistant", text: "New chat started!" }],
    }));
    setCurrentChat(newChatName);
  };

  return {
    chats,
    currentChat,
    setCurrentChat,
    addMessage,
    createNewChat,
  };
}
