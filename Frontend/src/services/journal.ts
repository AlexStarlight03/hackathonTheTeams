import { API_BASE_URL } from '../config';
import type { Journal } from '../types/journal';

function getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

function withAuth(headers: Record<string, string> = {}): Record<string, string> {
    return { ...headers, ...getAuthHeaders() };
}

export const createJournalEntry = async (userId: number | string, payload: Omit<Journal, 'id' | 'user'>): Promise<Journal> => {
    const res = await fetch(`${API_BASE_URL}/journals/${userId}`, {
        method: 'POST',
        headers: withAuth({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ ...payload, userId }),
    });
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    const result = await res.json();
    return result.data;
}

export const getJournalEntriesByUserId = async (userId: number): Promise<Journal[]> => {
    const res = await fetch(`${API_BASE_URL}/journals/${userId}`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    const result = await res.json();
    return result.data;
}

export const updateJournalEntry = async (userId: number, id: number, payload: Partial<Omit<Journal, 'id' | 'user'>>): Promise<Journal> => {
    const res = await fetch(`${API_BASE_URL}/journals/${userId}/${id}`, {
        method: 'PATCH',
        headers: withAuth({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    const result = await res.json();
    return result.data;
}

export const deleteJournalEntry = async (userId: number, id: number): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/journals/${userId}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return;
};