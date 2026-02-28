const API_BASE = "/api";

export async function getUserCount() {
    const res = await fetch(`${API_BASE}/users/count`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) {
        throw new Error("Failed to get user count");
    }

    return await res.json();
}

export async function login(credentials) {
    const { username, password } = credentials;
    const res = await fetch(`${API_BASE}/users?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Login failed");
    }

    // Backend returns empty string on success, so we create user object
    return { username };
}

export async function createNewAdmin(userData) {
    const { username, password } = userData;
    const res = await fetch(`${API_BASE}/users?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to create admin");
    }
    return { username };
}
