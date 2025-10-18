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

        const token = localStorage.getItem('token')

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
                // Token invalid, clear it
                localStorage.removeItem('token')
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    loading: false
                })
            }
        } else {
            set({ loading: false })
        }
    },

    // Login
    login: (userData, accessToken) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', accessToken)
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
            console.error('Logout error:', error)
        }

        if (typeof window !== 'undefined') {
            localStorage.removeItem('token')
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