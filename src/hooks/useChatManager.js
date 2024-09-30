import { useState } from "react";
import OpenAI from "openai";
import { useConfiguration } from "../context/ConfigurationContext";
import { marked } from "marked";
import markedCodePreview from "marked-code-preview";

marked
  .use({
    breaks: true,
    gfm: true,
  })
  .use(markedCodePreview());

export function useChatManager(initialChats) {
  const [chats, setChats] = useState(initialChats);
  const [currentChat, setCurrentChat] = useState("Chat 1");

  const { url, model, apiKey, systemPrompt } = useConfiguration();

  const configuration = {
    apiKey,
    basePath: url,
    dangerouslyAllowBrowser: true,
  };

  const client = new OpenAI(configuration);

  const addMessage = async (message) => {
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

    setTimeout(async () => {
      await handleAssistantResponse();
    }, 0);
  };

  const handleAssistantResponse = async () => {
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

    let assistantMessageIndex;

    setChats((prevChats) => {
      assistantMessageIndex = (prevChats[currentChat] || []).length;
      return {
        ...prevChats,
        [currentChat]: [
          ...(prevChats[currentChat] || []),
          { role: "assistant", text: "" },
        ],
      };
    });

    let deltaContent = "";

    for await (const chunk of stream) {
      deltaContent += chunk.choices[0]?.delta?.content || "";

      const htmlContent = marked.parse(deltaContent);

      setChats((prevChats) => {
        const updatedMessages = [...prevChats[currentChat]];
        if (updatedMessages[assistantMessageIndex]) {
          updatedMessages[assistantMessageIndex].text = htmlContent;
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
      [newChatName]: [{ role: "system", text: systemPrompt }],
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
