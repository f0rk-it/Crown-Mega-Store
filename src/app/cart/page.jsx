'use client'

import ProtectedRoute from "@/components/ProtectedRoute"

export default function CartPage() {
    return (
        <ProtectedRoute>
            <div>
                Your cart content here
            </div>
        </ProtectedRoute>
    )
}