import { API_BASE_URL } from '../config';
import type { Professionnel } from '../types';

export const createProfessionnel = async (userId: number, qualifications: string | string[]): Promise<{ user: any; professionnel: Professionnel }> => {
    const res = await fetch(`${API_BASE_URL}/professionnels/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qualifications }),
    });
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    const result = await res.json();
    return result;
}

export const getAllProfessionnels = async (): Promise<Professionnel[]> => {
    const res = await fetch(`${API_BASE_URL}/professionnels`);
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    const result = await res.json();
    return result.data;
}

export const getProfessionnelById = async (id: number): Promise<Professionnel> => {
    const res = await fetch(`${API_BASE_URL}/professionnels/${id}`);
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    const result = await res.json();
    return result.data;
}

export const updateProfessionnel = async (id: number, payload: Partial<{ qualifications: string | string[] }>): Promise<Professionnel> => {
    const res = await fetch(`${API_BASE_URL}/professionnels/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    const result = await res.json();
    return result.data;
}

export const deleteProfessionnel = async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/professionnels/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return;
};

export const userProStatus = async (userId: number): Promise<{ isProfessionnel: boolean }> => {
    const res = await fetch(`${API_BASE_URL}/professionnels/user/${userId}/status`);
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    const result = await res.json();
    return result;
}

