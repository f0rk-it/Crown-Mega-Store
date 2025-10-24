const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'


// Get auth token from localStorage
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

        // Handle different response types
        let data
        const contentType = response.headers.get('content-type')

        if (contentType && contentType.includes('application/json')) {
            data = await response.json()
        } else {
            data = { detail: await response.text() }
        }

        if (!response.ok) {
            // Log the full error details for debugging
            console.error('API Error Response:', {
                status: response.status,
                statusText: response.statusText,
                data: data,
                url: response.url
            })
            
            // Create a more informative error message
            let errorMessage = 'API request failed'
            
            if (data) {
                if (typeof data === 'string') {
                    errorMessage = data
                } else if (data.detail && Array.isArray(data.detail)) {
                    // Handle validation errors (Pydantic/FastAPI format)
                    const validationErrors = data.detail.map(err => {
                        const field = err.loc ? err.loc.join('.') : 'unknown field'
                        return `${field}: ${err.msg}`
                    }).join(', ')
                    errorMessage = `Validation error: ${validationErrors}`
                } else if (data.detail) {
                    errorMessage = data.detail
                } else if (data.message) {
                    errorMessage = data.message
                } else if (data.error) {
                    errorMessage = data.error
                } else {
                    errorMessage = JSON.stringify(data)
                }
            }
            
            const error = new Error(errorMessage)
            error.status = response.status
            error.response = data
            throw error
        }

        return data

    } catch (error) {
        // Only log errors that aren't authentication related
        if (!error.message?.includes('Not authenticated') && error.status !== 401) {
            console.error('API error:', error)
        }
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

    getCategories: () => {
        return apiRequest('/api/products/categories', {
            skipAuth: true
        })
    },

    // Admin endpoints
    create: (productData) => {
        return apiRequest('/api/products/', {
            method: 'POST',
            body: JSON.stringify(productData)
        })
    },

    update: (productId, productData) => {
        return apiRequest(`/api/products/${productId}`, {
            method: 'PUT',
            body: JSON.stringify(productData)
        })
    },

    delete: (productId) => {
        return apiRequest(`/api/products/${productId}`, {
            method: 'DELETE'
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

    update: (productId, quantity) => {
        // Since /api/cart/update doesn't exist, use remove + add approach
        return cartAPI.remove(productId).then(() => {
            if (quantity > 0) {
                return cartAPI.add(productId, quantity)
            }
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
    checkout: (orderData) => {
        return apiRequest('/api/orders/checkout', {
            method: 'POST',
            body: JSON.stringify(orderData)
        })
    },

    create: (orderData) => {
        return apiRequest('/api/orders/checkout', {
            method: 'POST',
            body: JSON.stringify(orderData)
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

    // Admin endpoints
    getAllOrders: (status = null, page = 1, limit = 50) => {
        const params = new URLSearchParams()
        if (status) params.append('status', status)
        params.append('page', page.toString())
        params.append('limit', limit.toString())
        return apiRequest(`/api/orders/?${params.toString()}`)
    },

    updateOrderStatus: (orderId, statusData) => {
        return apiRequest(`/api/orders/${orderId}/status`, {
            method: 'POST',
            body: JSON.stringify(statusData)
        })
    },

    recordPayment: (orderId, paymentData) => {
        return apiRequest(`/api/orders/${orderId}/payment`, {
            method: 'POST',
            body: JSON.stringify(paymentData)
        })
    },

    getStats: () => {
        return apiRequest('/api/orders/stats/dashboard')
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
            localStorage.removeItem('authToken')
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