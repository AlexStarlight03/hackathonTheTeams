import { API_BASE_URL } from "../config";
import type { Evenement } from "../types";

export const getAllEvenements = async (): Promise<Evenement[]> => {
    const res = await fetch(`${API_BASE_URL}/evenements`);
    if (!res.ok) {
        throw new Error("Network response was not ok");
    }
    const result = await res.json();
    return result.data;
};

export const getEvenementById = async (id: number): Promise<Evenement> => {
    const res = await fetch(`${API_BASE_URL}/evenements/${id}`);
    if (!res.ok) {
        throw new Error("Network response was not ok");
    }
    const result = await res.json();
    return result.data;
};

export const getEvenementsByGroupId = async (groupId: number): Promise<Evenement[]> => {
    const res = await fetch(`${API_BASE_URL}/groups/${groupId}/evenements`);
    if (!res.ok) {
        throw new Error("Network response was not ok");
    }
    const result = await res.json();
    return result.data;
};

export type CreateEvenementPayload = {
    nom: string;
    description: string;
    date: string;
    groupeId: number;
};

export const createEvenement = async (userId: number, payload: CreateEvenementPayload): Promise<Evenement> => {
    const res = await fetch(`${API_BASE_URL}/evenements/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        throw new Error("Network response was not ok");
    }
    const result = await res.json();
    return result.data;
};

export const updateEvenement = async (id: number, userId: number, payload: Partial<CreateEvenementPayload>): Promise<Evenement> => {
    const res = await fetch(`${API_BASE_URL}/evenements/${id}/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        throw new Error("Network response was not ok");
    }
    const result = await res.json();
    return result.data;
};

export const deleteEvenement = async (id: number, userId: number): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/evenements/${id}/${userId}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        throw new Error("Network response was not ok");
    }
    return;
};

