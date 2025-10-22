import { create } from "zustand"
import { authAPI } from "@/lib/api"

export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,

    // Initialize auth from localStorage
    initAuth: async () => {
        if (typeof window === 'undefined') return

        // Clear any old token formats
        localStorage.removeItem('token')
        localStorage.removeItem('access_token')
        
        const token = localStorage.getItem('authToken')

        if (token) {
            try {
                const user = await authAPI.getMe()
                set({
                    user,
                    token,
                    isAuthenticated: true,
                    loading: false
                })
            } catch (error) {
                console.warn('Token validation failed, clearing auth:', error.message)
                // Token invalid, clear it
                localStorage.removeItem('authToken')
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    loading: false
                })
            }
        } else {
            set({ 
                user: null,
                token: null,
                isAuthenticated: false,
                loading: false 
            })
        }
    },

    // Login
    login: (userData, accessToken) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('authToken', accessToken)
        }
        set({
            user: userData,
            token: accessToken,
            isAuthenticated: true
        })
    },

    // Logout
    logout: async () => {
        try {
            await authAPI.logout()
        } catch (error) {
            // Silently fail - just clear local state
            console.log('Logout API call failed, clearing local state anyway')
        }

        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken')
        }

        set({
            user: null,
            token: null,
            isAuthenticated: false
        })
    },

    // Update User
    updateUser: (userData) => {
        set({ user: userData })
    }
}))