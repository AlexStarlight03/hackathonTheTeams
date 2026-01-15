import { API_BASE_URL } from "../config";

export function isAuthenticated() {
    const token = localStorage.getItem("token");
    if (!token) return false;

    return fetch(`${API_BASE_URL}/dashboard`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
    }).then(res => {
        if (!res.ok) {
            return false;
        }
        return true;
    }).catch(() => false);
}

export function getUserIdFromToken(): number {
    const token = localStorage.getItem("token");
    if (!token) return -1;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return typeof payload.userId === 'number' ? payload.userId : Number(payload.sub);
    } catch {
        return -1;
    }
}

export function isUserProfessional(): boolean {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return !!payload.professionnel;
    } catch {
        return false;
    }
}

export function login(email: string, password: string) {
    return fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"},
        body: JSON.stringify({ email, password }),
    }).then(res => res.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem("token", data.token);
            return true;
        }
        return false;
    });
}

export function register(nom: string, prenom: string, email: string, password: string) {
    return fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nom, prenom, email, password }),
    }).then(res => res.json())
    .then(data => {
        if (data.success) {
            return true;
        }
        throw new Error(data.message || "L'inscription a échoué");
    });
}

export function logout() {
    localStorage.removeItem("token");
    return fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
    }).then(res => res.json());
}