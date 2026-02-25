const API_BASE = "/api/orders";
const TAX_API = "/api/tax";

export async function getOrders(params = {}) {
    // Формуємо query params, видаляючи пусті значення
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

    // Перевірка чи відповідь має контент
    const text = await res.text();
    if (!text || text.trim() === '') {
        console.warn('Empty response from backend');
        return { orders: [], totalElements: 0, totalPages: 0 };
    }

    try {
        const data = JSON.parse(text);
        console.log('Raw data from backend:', data);

        // Backend повертає Spring Page об'єкт з полем content, або просто масив
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

        // Переобробляємо дані з camelCase на snake_case та формуємо breakdown
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
        throw new Error('Не вдалося з\'єднатися з бекендом. Переконайтеся, що бекенд запущений на порті 8000.');
    }

    if (!res.ok) {
        // Спробувати отримати повідомлення про помилку
        let errorMessage = `Failed to create order (HTTP ${res.status})`;
        try {
            const errorText = await res.text();
            if (errorText) {
                try {
                    const errorData = JSON.parse(errorText);
                    // Може бути масив validation errors або об'єкт з message
                    if (Array.isArray(errorData)) {
                        errorMessage = errorData.map(e => `${e.field}: ${e.message}`).join(', ');
                    } else if (errorData.message) {
                        errorMessage = errorData.message;
                    }
                } catch {
                    // Не JSON — використовуємо текст як є
                    errorMessage = errorText;
                }
            }
        } catch {
            // Якщо не вдалося прочитати відповідь
        }
        throw new Error(errorMessage);
    }

    // Бекенд повертає пусто (void), тому просто повертаємо успіх
    return {
        success: true,
        message: 'Замовлення успішно створено!'
    };
}

export async function calculateTax(latitude, longitude, subtotal) {
    // MOCK: На бекенді нема /tax ендпоінту, тому використовуємо mock розрахунок
    // Це дозволяє протестувати фронтенд без змін беку

    // Симуляція затримки API запиту
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock розрахунок податків для Нью-Йорку
    const mockTaxRates = {
        // Manhattan
        '40.7128,-74.0060': { state: 0.04, county: 0.03875, city: 0.04875, special: [] },
        // Default для інших локацій
        'default': { state: 0.04, county: 0.03, city: 0.035, special: [] }
    };

    const key = `${latitude},${longitude}`;
    const rates = mockTaxRates[key] || mockTaxRates['default'];

    const compositeRate = rates.state + rates.county + rates.city +
        (rates.special?.reduce((sum, r) => sum + r.value, 0) || 0);

    const taxAmount = subtotal * compositeRate;

    return {
        composite_tax_rate: compositeRate,
        tax_amount: taxAmount,
        total_amount: subtotal + taxAmount,
        breakdown: {
            state_rate: rates.state,
            county_rate: rates.county,
            city_rate: rates.city,
            special_rates: rates.special || []
        }
    };

    // ЖИВИЙ КОД (коли буде /tax на бекенді):
    /*
    const res = await fetch(TAX_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude, longitude, subtotal })
    });
    if (!res.ok) throw new Error('Failed to calculate tax');
    return res.json();
    */
}

export async function importOrdersCsv(file) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/import`, {
        method: "POST",
        body: formData
    });
    if (!res.ok) throw new Error('Failed to import CSV');

    // Перевірка чи відповідь має контент
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