import React from "react";

export default function Sidebar({
  chats,
  setCurrentChat,
  createNewChat,
  currentChat,
  onConfigure,
}) {
  return (
    <div className="w-64 bg-gray-800 text-white p-4 flex flex-col justify-between h-screen">
      <div>
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        <ul className="space-y-2">
          {Object.keys(chats).map((chatName) => (
            <li
              key={chatName}
              onClick={() => setCurrentChat(chatName)}
              className={`p-2 rounded-lg cursor-pointer ${
                currentChat === chatName ? "bg-gray-700" : ""
              }`}
            >
              {chatName}
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-2">
        <button
          onClick={createNewChat}
          className="w-full p-2 bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          New Chat
        </button>
        <button
          onClick={onConfigure}
          className="w-full p-2 bg-gray-700 rounded-lg hover:bg-gray-600"
        >
          Configure
        </button>
      </div>
    </div>
  );
}
