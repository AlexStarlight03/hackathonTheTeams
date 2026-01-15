import type { Message } from "../types/message";

interface Props {
  messages: Message[];
  userId: number;
}

export function MessageList({ messages, userId }: Props) {
  return (
    <div className="space-y-2 overflow-y-auto">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`p-2 rounded max-w-[70%] ${
            msg.emmeteurId === userId
              ? "bg-blue-500 text-white ml-auto"
              : "bg-gray-200"
          }`}
        >
          <div className="text-sm font-semibold">
            {msg.emmeteur.prenom}
          </div>
          <div>{msg.message}</div>
          <div className="text-xs opacity-60">
            {new Date(msg.time).toLocaleTimeString()}
          </div>
        </div>
      ))}
    </div>
  );
}
