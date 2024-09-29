export default function ChatWindow({ messages }) {
  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-700 text-white">
      {messages
        .filter((message) => message.role !== "system")
        .map((message, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg ${
              message.role === "user" ? "bg-gray-600 self-end" : "bg-gray-800"
            }`}
          >
            {message.text}
          </div>
        ))}
    </div>
  );
}
