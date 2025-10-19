'use client'

import { GoogleOAuthProvider } from '@react-oauth/google'

export default function AuthProvider({ children }) {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

    if (!googleClientId) {
        console.warn('NEXT_PUBLIC_GOOGLE_CLIENT_ID not configured. Google Auth will be disabled.')
        return children
    }

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            {children}
        </GoogleOAuthProvider>
    )
}