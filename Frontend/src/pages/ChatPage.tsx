import { useMessages } from "../hooks/useMessages";
import { MessageList } from "../components/MessageList";
import { MessageInput } from "../components/MessageInput";

interface Props {
  discussionId: number;
  userId: number;
}

export default function ChatPage({ discussionId, userId }: Props) {
  const { messages, send, loading } = useMessages(discussionId, userId);

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} userId={userId} />
      </div>
      <div className="p-4 border-t">
        <MessageInput onSend={send} />
      </div>
    </div>
  );
}
