const API_BASE = "/api/orders";

export async function getOrders(params = {}) {
    // Build query params, removing empty values
    const cleanParams = {};
    for (const [key, value] of Object.entries(params)) {
        if (value !== '' && value !== null && value !== undefined) {
            cleanParams[key] = value;
        }
    }
    const queryString = new URLSearchParams(cleanParams).toString();
    const url = queryString ? `${API_BASE}?${queryString}` : API_BASE;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch orders');

    // Check if response has content
    const text = await res.text();
    if (!text || text.trim() === '') {
        console.warn('Empty response from backend');
        return { orders: [], totalElements: 0, totalPages: 0 };
    }

    try {
        const data = JSON.parse(text);
        console.log('Raw data from backend:', data);

        // Backend returns a Spring Page object with content field, or a plain array
        let orders;
        let totalElements = 0;
        let totalPages = 0;
        if (Array.isArray(data)) {
            orders = data;
            totalElements = data.length;
            totalPages = 1;
        } else if (data && Array.isArray(data.content)) {
            orders = data.content;
            totalElements = data.totalElements ?? orders.length;
            totalPages = data.totalPages ?? 1;
        } else {
            console.error('Unexpected response format:', typeof data, data);
            return { orders: [], totalElements: 0, totalPages: 0 };
        }

        // Map data from camelCase to snake_case and build breakdown
        const mappedOrders = orders.map((order, idx) => {
            console.log(`Processing order ${idx}:`, order);

            const latitude = typeof order.latitude === 'string' ? parseFloat(order.latitude) : order.latitude;
            const longitude = typeof order.longitude === 'string' ? parseFloat(order.longitude) : order.longitude;
            const subtotal = typeof order.subtotal === 'string' ? parseFloat(order.subtotal) : order.subtotal;
            const compositeTaxRate = typeof order.compositeTaxRate === 'string' ? parseFloat(order.compositeTaxRate) : order.compositeTaxRate;
            const taxAmount = typeof order.taxAmount === 'string' ? parseFloat(order.taxAmount) : order.taxAmount;
            const totalAmount = typeof order.totalAmount === 'string' ? parseFloat(order.totalAmount) : order.totalAmount;

            if (isNaN(latitude) || isNaN(longitude) || isNaN(subtotal)) {
                console.warn(`Invalid numeric values in order ${order.id}:`, {latitude, longitude, subtotal});
            }

            return {
                id: order.id,
                latitude: latitude,
                longitude: longitude,
                subtotal: subtotal,
                composite_tax_rate: compositeTaxRate,
                tax_amount: taxAmount,
                total_amount: totalAmount,
                jurisdictions: order.jurisdictions,
                createdAt: order.timestamp,
                breakdown: {
                    state_rate: order.stateRate,
                    county_rate: order.countyRate,
                    city_rate: order.cityRate,
                    special_rates: order.specialRate > 0 ? [{
                        name: 'Special',
                        value: order.specialRate
                    }] : []
                }
            };
        });

        return { orders: mappedOrders, totalElements, totalPages };
    } catch (error) {
        console.error('Failed to parse or process JSON:', text, error);
        return { orders: [], totalElements: 0, totalPages: 0 };
    }
}

export async function createOrder(payload) {
    // payload: { latitude, longitude, subtotal, timestamp }
    let res;
    try {
        res = await fetch(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
    } catch (networkError) {
        console.error('Network error creating order:', networkError);
        throw new Error('Could not connect to backend.');
    }

    if (!res.ok) {
        // Try to extract error message
        let errorMessage = `Failed to create order (HTTP ${res.status})`;
        try {
            const errorText = await res.text();
            if (errorText) {
                try {
                    const errorData = JSON.parse(errorText);
                    // Could be a validation errors array or an object with message
                    if (Array.isArray(errorData)) {
                        errorMessage = errorData.map(e => `${e.field}: ${e.message}`).join(', ');
                    } else if (errorData.message) {
                        errorMessage = errorData.message;
                    }
                } catch {
                    // Not JSON — use text as-is
                    errorMessage = errorText;
                }
            }
        } catch {
            // Failed to read response
        }
        throw new Error(errorMessage);
    }

    // Backend returns void, so just return success
    return {
        success: true,
        message: 'Order created successfully!'
    };
}

export async function importOrdersCsv(file) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/import`, {
        method: "POST",
        body: formData
    });
    if (!res.ok) throw new Error('Failed to import CSV');

    // Check if response has content
    const text = await res.text();
    if (!text || text.trim() === '') {
        return { importedCount: 0, skippedCount: 0, totalCount: 0 };
    }

    try {
        return JSON.parse(text);
    } catch {
        console.error('Failed to parse JSON:', text);
        throw new Error('Invalid response from server');
    }
}