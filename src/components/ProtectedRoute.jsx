'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"

export default function ProtectedRoute({ children, redirectTo = '/auth/signin' }) {
    const router = useRouter()
    const { isAuthenticated, loading } = useAuthStore()

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            // Save current path for redirect after login
            const currentPath = window.location.pathname
            router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`)
        }
    }, [isAuthenticated, loading, router, redirectTo])

    // Show loading spinner while checking auth
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: 'var(--color-background)'
            }}>
                <div className='spinner'></div>
            </div>
        )
    }

    // Don't render children if not authenticated
    if (!isAuthenticated) {
        return null
    }

    return children
}