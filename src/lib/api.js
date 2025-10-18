const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('authToken')
    }
    return null
}

// API request helper
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const token = getAuthToken()

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    }

    if (token && !options.skipAuth) {
        headers['Authorization'] = `Bearer ${token}`
    }

    const config = {
        ...options,
        headers,
    }

    try {
        const response = await fetch(url, config)
        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.detail || 'API request failed')
        }

        return data
    } catch (error) {
        console.error('API Error:', error)
        throw error
    }
}

// Products API
export const productsAPI = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return apiRequest(`/api/products${query ? `?${query}` : ''}`, {
            skipAuth: true
        })
    },

    getById: (id) => {
        return apiRequest(`/api/products/${id}`, {
            skipAuth: true
        })
    },

    search: (searchTerm) => {
        return apiRequest(`/api/products/search?q=${encodeURIComponent(searchTerm)}`, {
            skipAuth: true
        })
    },
}

// Cart API
export const cartAPI = {
    get: () => apiRequest('/api/cart'),

    add: (productId, quantity = 1) => {
        return apiRequest('/api/cart/add', {
            method: 'POST',
            body: JSON.stringify({
                product_id: productId,
                quantity
            })
        })
    },

    remove: (productId) => {
        return apiRequest(`/api/cart/remove/${productId}`, {
            method: 'DELETE'
        })
    },

    clear: () => {
        return apiRequest('/api/cart/clear', {
            method: 'DELETE'
        })
    },

    getCount: () => apiRequest('/api/cart/count'),
}

// Orders API
export const ordersAPI = {
    create: (orderData) => {
        return apiRequest('/api/orders/checkout', {
            method: 'POST',
            body: JSON.stringify(orderData),
            skipAuth: true
        })
    },

    getById: (orderId) => {
        return apiRequest(`/api/orders/${orderId}`, {
            skipAuth: true
        })
    },

    getMyOrders: (status = null) => {
        const query = status ? `?status=${status}` : ''
        return apiRequest(`/api/orders/user/my-orders${query}`)
    },
}

// Recommendations API
export const recommendationsAPI = {
    getForYou: (limit = 8) => {
        return apiRequest(`/api/recommendations/for-you?limit=${limit}`)
    },

    getSimilar: (productId, limit = 6) => {
        return apiRequest(`/api/recommendations/similar/${productId}?limit=${limit}`, {
            skipAuth: true
        })
    },

    getTrending: (limit = 8) => {
        return apiRequest(`/api/recommendations/trending?limit=${limit}`, {
            skipAuth: true
        })
    },

    getPopular: (limit = 8) => {
        return apiRequest(`/api/recommendations/popular?limit=${limit}`, {
            skipAuth: true
        })
    },

    trackActivity: (productId, activityType) => {
        return apiRequest('/api/recommendations/track', {
            method: 'POST',
            body: JSON.stringify({
                product_id: productId,
                activity_type: activityType
            })
        })
    },
}

// Auth API
export const authAPI = {
    googleLogin: (token) => {
        return apiRequest('/api/auth/google', {
            method: 'POST',
            body: JSON.stringify({ token }),
            skipAuth: true
        })
    },

    getMe: () => apiRequest('/api/auth/me'),

    verifyToken: () => apiRequest('/api/auth/verify'),

    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token')
        }
        return apiRequest('/api/auth/logout', {
            method: 'POST'
        })
    },
}

const api = {
    products: productsAPI,
    cart: cartAPI,
    orders: ordersAPI,
    recommendations: recommendationsAPI,
    auth: authAPI,
}

export default api