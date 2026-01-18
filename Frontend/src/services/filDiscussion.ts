import { API_BASE_URL } from "../config";
import type { FilDiscussion } from "../types/filDiscussion";

export const getFilDiscussionsByGroupId = async (groupId: number): Promise<FilDiscussion[]> => {
    const res = await fetch(`${API_BASE_URL}/discussions/group/${groupId}`);
    if (!res.ok) {
        throw new Error("Failed to fetch group discussions");
    }
    const result = await res.json();
    return result;
}

export const getFilDiscussionsUserGroup = async (userId: number): Promise<FilDiscussion[]> => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE_URL}/discussions/${userId}?type=group`, {
    headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch user discussions");
    }
    const result = await res.json();
    return result;
}

export const getFilDiscussionsUserPrivate = async (userId: number): Promise<FilDiscussion[]> => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE_URL}/discussions/${userId}?type=private`, {
    headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch user discussions");
    }
    const result = await res.json();
    return result;
}

export const getFilDiscussionById = async (discussionId: number): Promise<FilDiscussion> => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/discussions/${discussionId}`,
        {headers: { "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
         }}
    );
    if (!res.ok) {
        throw new Error("Failed to fetch discussion");
    }
    const result = await res.json();
    return result;
}

export const createPrivateDiscussion = async (titre: string, participantIds: number[]): Promise<FilDiscussion> => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/discussions/private`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ titre, participantIds }),
    });
    if (!res.ok) {
        throw new Error("Failed to create private discussion");
    }
    const result = await res.json();
    return result;
}

export const createGroupDiscussion = async (titre: string, groupeId: number, participantIds?: number[]): Promise<FilDiscussion> => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/discussions/group/${groupeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
         },
        body: JSON.stringify({ titre, groupeId, participantIds }),
    });
    if (!res.ok) {
        throw new Error("Failed to create group discussion");
    }
    const result = await res.json();
    return result;
}

export const updateDiscussion = async (
    id: number,
    data: { titre?: string; addParticipantIds?: number[]; removeParticipantIds?: number[] }
): Promise<FilDiscussion> => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/discussions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
         },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        throw new Error("Failed to update discussion");
    }
    const result = await res.json();
    return result;
}

export const deleteDiscussion = async (id: number): Promise<void> => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/discussions/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
    if (!res.ok) {
        throw new Error("Failed to delete discussion");
    }
    return;
}