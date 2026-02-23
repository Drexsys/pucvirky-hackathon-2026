const API_BASE = "http://localhost:8000/api/orders";

export async function getOrders() {
    const res = await fetch(API_BASE);
    return res.json();
}

export async function createOrder(payload) {
    const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    return res.json();
}

export async function importOrdersCsv(csvText) {
    const res = await fetch(`${API_BASE}/import`, {
        method: "POST",
        headers: { "Content-Type": "text/csv" },
        body: csvText
    });
    return res.json();
}