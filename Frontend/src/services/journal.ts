import { API_BASE_URL } from '../config';
import type { Journal } from '../types/journal';

export const createJournalEntry = async (userId: number | string, payload: Omit<Journal, 'id' | 'user'>): Promise<Journal> => {
    const res = await fetch(`${API_BASE_URL}/journals/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    const result = await res.json();
    return result.data;
}

export const getJournalEntriesByUserId = async (userId: number): Promise<Journal[]> => {
    const res = await fetch(`${API_BASE_URL}/journals/user/${userId}`);
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    const result = await res.json();
    return result.data;
}

export const getJournalEntries = async (): Promise<Journal[]> => {
    const res = await fetch(`${API_BASE_URL}/journals`);
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    const result = await res.json();
    return result.data;
}

export const updateJournalEntry = async (id: number, payload: Partial<Omit<Journal, 'id' | 'user'>>): Promise<Journal> => {
    const res = await fetch(`${API_BASE_URL}/journals/${id}`, {
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

export const deleteJournalEntry = async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/journals/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return;
};

