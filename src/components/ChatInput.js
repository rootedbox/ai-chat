import { useState } from "react";

export default function ChatInput({ addMessage }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      addMessage(input);
      setInput("");
    }
  };

  return (
    <div className="p-4 border-t border-gray-600 bg-gray-800">
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 rounded-lg bg-gray-700 text-white"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 rounded bg-blue-500 hover:bg-blue-700 text-white"
        >
          Send
        </button>
      </form>
    </div>
  );
}
