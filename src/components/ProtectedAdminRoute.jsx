'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

export default function ProtectedAdminRoute({ children }) {
    const router = useRouter()
    const { isAuthenticated, user, loading } = useAuthStore()

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                toast.error('Please sign in to access admin area')
                router.push('/auth/signin?redirect=/admin/dashboard')
                return
            }

            if (user?.role !== 'admin') {
                toast.error('Access denied. Admin privileges required.')
                router.push('/')
                return
            }
        }
    }, [isAuthenticated, user, loading, router])

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Checking permissions...</p>
                </div>
            </div>
        )
    }

    // Show access denied if not authenticated or not admin
    if (!isAuthenticated || user?.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
                    <p className="text-gray-600 mb-8">You need admin privileges to access this area.</p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Go to Homepage
                    </button>
                </div>
            </div>
        )
    }

    // Render admin content if user is authenticated and is admin
    return <>{children}</>
}