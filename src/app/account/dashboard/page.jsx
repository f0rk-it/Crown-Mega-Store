'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import Link from 'next/link'
import styles from './dashboard.module.css'

export default function AccountDashboard() {
    const router = useRouter()
    const { isAuthenticated, user, loading: authLoading } = useAuthStore()

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/auth/signin?redirect=/account/dashboard')
        }
    }, [isAuthenticated, authLoading, router])

    if (authLoading || !isAuthenticated) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>My Account</h1>
                <p>Welcome back, {user?.name}!</p>
            </div>

            <div className={styles.dashboardGrid}>
                <Link href="/account/orders" className={styles.dashboardCard}>
                    <div className={styles.cardIcon}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 0 1-8 0"/>
                        </svg>
                    </div>
                    <div className={styles.cardContent}>
                        <h2>My Orders</h2>
                        <p>View and track your orders</p>
                    </div>
                    <div className={styles.cardArrow}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="9,18 15,12 9,6"></polyline>
                        </svg>
                    </div>
                </Link>

                <div className={styles.dashboardCard}>
                    <div className={styles.cardIcon}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                    </div>
                    <div className={styles.cardContent}>
                        <h2>Profile Information</h2>
                        <p>Manage your account details</p>
                        <div className={styles.profileInfo}>
                            <p><strong>Name:</strong> {user?.name}</p>
                            <p><strong>Email:</strong> {user?.email}</p>
                        </div>
                    </div>
                </div>

                <Link href="/shop" className={styles.dashboardCard}>
                    <div className={styles.cardIcon}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 0 1-8 0"/>
                        </svg>
                    </div>
                    <div className={styles.cardContent}>
                        <h2>Browse Products</h2>
                        <p>Discover our latest collections</p>
                    </div>
                    <div className={styles.cardArrow}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="9,18 15,12 9,6"></polyline>
                        </svg>
                    </div>
                </Link>

                <div className={styles.dashboardCard}>
                    <div className={styles.cardIcon}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                    </div>
                    <div className={styles.cardContent}>
                        <h2>Support</h2>
                        <p>Get help with your orders</p>
                        <div className={styles.supportInfo}>
                            <p>📞 +234 806 840 2757</p>
                            <p>📧 crownmegastore@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.quickActions}>
                <h2>Quick Actions</h2>
                <div className={styles.actionButtons}>
                    <Link href="/shop" className={styles.actionButton}>
                        Continue Shopping
                    </Link>
                    <Link href="/account/orders" className={styles.actionButton}>
                        View Orders
                    </Link>
                </div>
            </div>
        </div>
    )
}