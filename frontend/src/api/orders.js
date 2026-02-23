const API_BASE = "http://localhost:8000/api/orders";
const TAX_API = "http://localhost:8000/api/tax";

export async function getOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API_BASE}?${queryString}` : API_BASE;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
}

export async function createOrder(payload) {
    // payload: { lat, lon, subtotal }
    const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to create order');
    return res.json();
}

export async function calculateTax(lat, lon, subtotal) {
    // Calculate tax for given coordinates and amount
    const res = await fetch(TAX_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lon, subtotal })
    });
    if (!res.ok) throw new Error('Failed to calculate tax');
    return res.json();
}

export async function importOrdersCsv(file) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/import`, {
        method: "POST",
        body: formData
    });
    if (!res.ok) throw new Error('Failed to import CSV');
    return res.json();
}