'use client'

import { useEffect } from "react"
import { useAuthStore } from "@/store/authStore"
import { userCartStore } from "@/store/cartStore"

export default function AuthInitializer({ children }) {
    const {initAuth, isAuthenticated} = useAuthStore()
    const {fetchCart} = userCartStore()

    useEffect(() => {
        initAuth()
    }, [initAuth])

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart()
        }
    }, [isAuthenticated, fetchCart])

    return children
}