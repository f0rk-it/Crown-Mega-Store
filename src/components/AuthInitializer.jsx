'use client'

import { useEffect } from "react"
import { useAuthStore } from "@/store/authStore"
import { userCartStore } from "@/store/cartStore"

export default function AuthInitializer({ children }) {
    const { initAuth, isAuthenticated, loading } = useAuthStore()
    const { fetchCart } = userCartStore()

    useEffect(() => {
        initAuth()
    }, [initAuth])

    useEffect(() => {
        if ( !loading && isAuthenticated) {
            fetchCart()
        }
    }, [isAuthenticated, loading, fetchCart])

    return children
}