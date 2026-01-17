import { useMessages } from "../hooks/useMessages";
import { MessageList } from "../components/MessageList";
import { MessageInput } from "../components/MessageInput";
import { getFilDiscussionById } from "../services/filDiscussion";
import type { FilDiscussion } from "../types/filDiscussion";
import { useEffect, useState } from "react";

interface Props {
  discussionId: number;
  userId: number;
}

export default function ChatPage({ discussionId, userId }: Props) {
  const { messages, send, loading } = useMessages(discussionId, userId);
  const [discussion, setDiscussion] = useState<FilDiscussion | null>(null);
  const [loadingDiscussion, setLoadingDiscussion] = useState(true);

  useEffect(() => {
    setLoadingDiscussion(true);
    getFilDiscussionById(discussionId)
      .then(setDiscussion)
      .finally(() => setLoadingDiscussion(false));
  }, [discussionId]);

  if (loading || loadingDiscussion) return <p>Chargement...</p>;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-gray-100">
        <h2 className="text-xl font-bold">
          {discussion?.titre || "Discussion"}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} userId={userId} />
      </div>
      <div className="p-4 border-t">
        <MessageInput onSend={send} />
      </div>
    </div>
  );
}
