'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../../../styles/auth.module.css'

export default function SignInPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleGoogleSignIn = async () => {
        setLoading(true)

        try {
            // TODO: Implement Google Sign-In logic here
            console.log('Google Sign-In initiated')
            alert('Google Sign-In is not implemented yet.')
        } catch (error) {
            console.error('Sign in error:', error)
            alert('Failed to sign in. Please try again.')
        } finally {
            setLoading(false)
        }
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
                            <button
                                className={styles.googleButton}
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className={styles.buttonSpinner}></div>
                                ) : (
                                    <>
                                        <svg width="24" height="24" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                        </svg>
                                        <span>Continue with Google</span>
                                    </>
                                )}
                            </button>

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

                            {/* Sign Up Link */}
                            <div className={styles.switchAuth}>
                                <p>
                                    Don't have an account?{' '}
                                    <a href="/auth/signup">Sign Up</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}