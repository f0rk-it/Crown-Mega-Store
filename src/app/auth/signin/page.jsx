'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GoogleLogin } from '@react-oauth/google'
import { useAuthStore } from '@/store/authStore'
import { authAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import styles from '../../../styles/auth.module.css'

export default function SignInPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { login } = useAuthStore()
    const isGoogleConfigured = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true)
        const loadingToast = toast.loading('Signing you in...')

        try {
            // Send Google Token to Backend
            const response = await authAPI.googleLogin(credentialResponse.credential)

            // Store token and user data
            login(response.user, response.access_token)

            toast.success('Welcome back!', { id: loadingToast })

            // Redirect to home or previous page
            const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/'
            router.push(redirectTo)
        } catch (error) {
            console.error('Google Sign-In Error:', error)
            toast.error('Failed to sign in. Please try again.', { id: loadingToast })
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleError = () => {
        toast.error('Google sign in failed. Please try again')
    }

    return (
        <div className={styles.authPage}>
            <div className={styles.authContainer}>
                <div className={styles.authCard}>
                    {/* Left Side - Branding */}
                    <div className={styles.authBranding}>
                        <div className={styles.brandingContent}>
                            <img src="/logo.png" alt="Crown Mega Store Logo" className={styles.brandLogo} />
                            <p className={styles.brandTagline}>
                                Your one-stop shop for amazing products at unbeatable prices
                            </p>
                            <div className={styles.brandFeatures}>
                                <div className={styles.brandFeature}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                    <span>Quality Products</span>
                                </div>
                                <div className={styles.brandFeature}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                    <span>Fast Delivery</span>
                                </div>
                                <div className={styles.brandFeature}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                    <span>Secure Payment</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Sign In Form */}
                    <div className={styles.authForm}>
                        <div className={styles.formContent}>
                            <h2 className={styles.formTitle}>Welcome Back!</h2>
                            <p className={styles.formSubtitle}>
                                Sign in to access your account and continue shopping
                            </p>

                            {/* Google Sign In Button */}
                            {isGoogleConfigured ? (
                                <div className={styles.googleButtonWrapper}>
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={handleGoogleError}
                                        useOneTap
                                        theme='outline'
                                        size='large'
                                        text='continue_with'
                                        shape='rectangular'
                                        width='100%'
                                        disabled={loading}
                                    />
                                </div>
                            ) : (
                                <div className={styles.comingSoon}>
                                    <p>Google Sign-In not configured</p>
                                    <small>Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID</small>
                                </div>
                            )}

                            <div className={styles.divider}>
                                <span>or</span>
                            </div>

                            {/* Email Sign In (Coming Soon) */}
                            <div className={styles.comingSoon}>
                                <p>Email/Password sign in coming soon</p>
                            </div>

                            {/* Terms */}
                            <p className={styles.terms}>
                                By continuing, you agree to our{' '}
                                <a href="/terms">Terms of Service</a> and {' '}
                                <a href="/privacy">Privacy Policy</a>
                            </p>

                            {/* Back to Home */}
                            <div className={styles.switchAuth}>
                                <p>
                                    <a href="/">← Back to Home</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}