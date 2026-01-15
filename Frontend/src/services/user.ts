import { API_BASE_URL } from '../config';
import type { User } from '../types';

export const getAllUsers = async (): Promise<User[]> => {
    const res = await fetch(`${API_BASE_URL}/users`);
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    const result = await res.json();
    return result.data;
}

export const getUserById = async (id: number): Promise<User> => {
    const res = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    const result = await res.json();
    return result.data;
}

export const createUser = async (payload: { nom: string; prenom: string; email: string; mot_de_passe: string; }): Promise<User> => {
    const res = await fetch(`${API_BASE_URL}/users`, {
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

export const updateUser = async (id: number, payload: Partial<{ nom: string; prenom: string; email: string; mot_de_passe: string; }>): Promise<User> => {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    const result = await res.json();
    return result.data;
};

export const deleteUser = async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return;
};


