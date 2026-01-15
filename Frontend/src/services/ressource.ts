import { API_BASE_URL } from "../config";
import type { Ressource } from "../types";

export const getAllRessources = async (): Promise<Ressource[]> => {
    const res = await fetch(`${API_BASE_URL}/ressources`);
    if (!res.ok) {
        throw new Error("Network response was not ok");
    }
    const result = await res.json();
    return result.data;
};

export const getRessourceById = async (id: number): Promise<Ressource> => {
    const res = await fetch(`${API_BASE_URL}/ressources/${id}`);
    if (!res.ok) {
        throw new Error("Network response was not ok");
    }
    const result = await res.json();
    return result.data;
};

export type CreateRessourcePayload = {
    nom: string;
    description: string;
};

export const createRessource = async (userId: number, payload: CreateRessourcePayload): Promise<Ressource> => {
    const res = await fetch(`${API_BASE_URL}/ressources/${userId}`, {
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

export const updateRessource = async (id: number, userId: number, payload: Partial<CreateRessourcePayload>): Promise<Ressource> => {
    const res = await fetch(`${API_BASE_URL}/ressources/${id}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        throw new Error("Network response was not ok");
    }
    const result = await res.json();
    return result.data;
};

export const deleteRessource = async (id: number, userId: number): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/ressources/${id}/${userId}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        throw new Error("Network response was not ok");
    }
    return;
};