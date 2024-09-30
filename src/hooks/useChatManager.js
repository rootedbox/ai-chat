import { useState } from "react";
import OpenAI from "openai";
import { useConfiguration } from "../context/ConfigurationContext";

export function useChatManager(initialChats) {
  const [chats, setChats] = useState(initialChats);
  const [currentChat, setCurrentChat] = useState("Chat 1");

  const { url, model, apiKey } = useConfiguration();

  const configuration = {
    apiKey,
    basePath: url,
    dangerouslyAllowBrowser: true,
  };

  const client = new OpenAI(configuration);

  const addMessage = async (message) => {
    // Add the user's message
    setChats((prevChats) => {
      const updatedChats = {
        ...prevChats,
        [currentChat]: [
          ...(prevChats[currentChat] || []),
          { role: "user", text: message },
        ],
      };
      return updatedChats;
    });

    // Wait for the state to be updated and then call handleAssistantResponse
    setTimeout(async () => {
      await handleAssistantResponse();
    }, 0);
  };

  const handleAssistantResponse = async () => {
    // Fetch the latest state of chats synchronously
    const updatedChats = await new Promise((resolve) => {
      setChats((prevChats) => {
        const currentMessages = prevChats[currentChat] || [];
        const chatMessages = currentMessages.map((msg) => ({
          role: msg.role,
          content: msg.text,
        }));
        resolve(chatMessages);
        return prevChats;
      });
    });

    const stream = await client.chat.completions.create({
      model: model,
      messages: updatedChats,
      stream: true,
    });

    // Create a placeholder for the assistant's message
    let assistantMessageIndex;

    setChats((prevChats) => {
      assistantMessageIndex = (prevChats[currentChat] || []).length;
      return {
        ...prevChats,
        [currentChat]: [
          ...(prevChats[currentChat] || []),
          { role: "assistant", text: "" }, // Placeholder for the streaming message
        ],
      };
    });

    let deltaContent = "";

    for await (const chunk of stream) {
      deltaContent += chunk.choices[0]?.delta?.content || "";

      setChats((prevChats) => {
        const updatedMessages = [...prevChats[currentChat]];
        if (updatedMessages[assistantMessageIndex]) {
          updatedMessages[assistantMessageIndex].text = deltaContent;
        }

        return {
          ...prevChats,
          [currentChat]: updatedMessages,
        };
      });
    }
  };

  const createNewChat = () => {
    const newChatName = `Chat ${Object.keys(chats).length + 1}`;
    setChats((prevChats) => ({
      ...prevChats,
      [newChatName]: [],
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
