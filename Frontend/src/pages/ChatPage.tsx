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
    <div className="chat-page-container">
      <div className="chat-header">
        <h2>
          {discussion?.titre || "Discussion"}
        </h2>
      </div>
      <div className="chat-messages">
        <MessageList messages={messages} userId={userId} />
      </div>
      <div className="chat-input">
        <MessageInput onSend={send} />
      </div>
    </div>
  );
}
