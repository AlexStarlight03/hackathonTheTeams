import { useEffect, useState } from "react";
import type { Message } from "../types/message";
import { getMessagesByDiscussion, sendMessage } from "../api/message.api";

export function useMessages(discussionId: number, userId: number) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getMessagesByDiscussion(discussionId)
      .then((res) => setMessages(res.messages))
      .finally(() => setLoading(false));
  }, [discussionId]);

  const send = async (content: string) => {
    const newMsg = await sendMessage({
      id_discussion: discussionId,
      message: content,
      emmeteurId: userId,
    });

    setMessages((prev) => [...prev, newMsg]);
  };

  return { messages, send, loading };
}
