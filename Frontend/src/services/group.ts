import { API_BASE_URL } from '../config';
import type { Group } from '../types';

export const getGroups = async (): Promise<Group[]> => {
    const response = await fetch(`${API_BASE_URL}/groups`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const result = await response.json();
    return result.data;
};

export const getGroupById = async (id: number): Promise<Group> => {
    const res = await fetch(`${API_BASE_URL}/groups/${id}`);
    if (!res.ok) {
        throw new Error('Network response was not ok');
    };
    const result = await res.json();
    return result.data;;
};

export type CreateGroupPayload = {
    nom: string;
    description: string;
    createurId: number;
    new_inscription: boolean;
}

export const createGroup = async (payload: CreateGroupPayload): Promise<Group> => {
    const res = await fetch(`${API_BASE_URL}/groups`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    const result = await res.json();
    return result.data;
};

export const joinGroup = async (groupId: number, userId: number): Promise<Group> => {
    const res = await fetch(`${API_BASE_URL}/groups/${groupId}/join/${userId}`, {
        method: 'POST',
    });
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    const result = await res.json();
    return result.data;
};

export const leaveGroup = async (groupId: number, userId: number): Promise<Group> => {
    const res = await fetch(`${API_BASE_URL}/groups/${groupId}/leave/${userId}`, {
        method: 'POST',
    });
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    const result = await res.json();
    return result.data;
};

export const addModerateur = async (groupId: number, userId: number): Promise<Group> => {
    const res = await fetch(`${API_BASE_URL}/groups/${groupId}/addmod/${userId}`, {
        method: 'POST',
    });
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    const result = await res.json();
    return result.data;
};

export const deleteModerateur = async (groupId: number, userId: number): Promise<Group> => {
    const res = await fetch(`${API_BASE_URL}/groups/${groupId}/deletemod/${userId}`, {
        method: 'POST',
    });
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    const result = await res.json();
    return result.data;
};

export type UpdateGroupPayload = {
    nom?: string;
    description?: string;
    new_inscription?: boolean;
}

export const updateGroup = async (id: number, userId: number, payload: UpdateGroupPayload): Promise<Group> => {
    const res = await fetch(`${API_BASE_URL}/groups/${id}/${userId}`, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    const result = await res.json();
    return result.data;
};

export const deleteGroup = async (id: number, userId: number): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE_URL}/groups/${id}/${userId}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    const result = await res.json();
    return result.data;
};