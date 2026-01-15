import type { MessagesResponse, Message } from "../types/message";

const API_URL = import.meta.env.VITE_API_URL;

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export async function getMessagesByDiscussion(
  discussionId: number,
  page = 1,
  limit = 50
): Promise<MessagesResponse> {
  const res = await fetch(
    `${API_URL}/messages/discussion/${discussionId}?page=${page}&limit=${limit}`,
    { headers: authHeaders() }
  );

  if (!res.ok) throw new Error("Erreur chargement messages");
  return res.json();
}

export async function sendMessage(data: {
  id_discussion: number;
  message: string;
  emmeteurId: number;
}): Promise<Message> {
  const res = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Erreur envoi message");
  return res.json();
}

export async function deleteMessage(messageId: number) {
  const res = await fetch(`${API_URL}/messages/${messageId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Erreur suppression message");
}
