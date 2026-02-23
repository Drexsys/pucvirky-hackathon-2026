const API_BASE = "http://localhost:8000/api/auth";

export async function login(credentials) {
    const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
    });
    if (!res.ok) {
        throw new Error("Login failed");
    }
    return res.json();
}

export async function register(userData) {
    const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    });
    if (!res.ok) {
        throw new Error("Registration failed");
    }
    return res.json();
}

export async function logout() {
    const res = await fetch(`${API_BASE}/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    });
    return res.json();
}

