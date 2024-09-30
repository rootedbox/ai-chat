import { useEffect, useRef } from "react";

export default function ChatWindow({ messages }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 p-4 space-y-4 bg-gray-700 text-white overflow-y-auto">
      {messages
        .filter((message) => message.role !== "system")
        .map((message, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg ${
              message.role === "user" ? "bg-gray-600 self-end" : "bg-gray-800"
            }`}
            dangerouslySetInnerHTML={{ __html: message.text }}
          ></div>
        ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
