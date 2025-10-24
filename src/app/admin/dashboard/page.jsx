'use client'

import { useState, useEffect } from 'react'
import { ordersAPI } from '@/lib/api'
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute'
import Link from 'next/link'
import styles from './dashboard.module.css'

export default function AdminDashboard() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await ordersAPI.getStats()
            setStats(response)
        } catch (error) {
            console.error('Failed to fetch admin stats:', error)
            setError('Failed to load dashboard statistics')
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN'
        }).format(amount)
    }

    if (loading) {
        return (
            <ProtectedAdminRoute>
                <div className={styles.container}>
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Loading dashboard...</p>
                    </div>
                </div>
            </ProtectedAdminRoute>
        )
    }

    if (error) {
        return (
            <ProtectedAdminRoute>
                <div className={styles.container}>
                    <div className={styles.error}>
                        <h2>Error Loading Dashboard</h2>
                        <p>{error}</p>
                        <button onClick={fetchStats} className={styles.retryButton}>
                            Try Again
                        </button>
                    </div>
                </div>
            </ProtectedAdminRoute>
        )
    }

    return (
        <ProtectedAdminRoute>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Admin Dashboard</h1>
                    <p>Welcome to Crown Mega Store administration panel</p>
                </div>

                {/* Stats Cards */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                                <line x1="3" y1="6" x2="21" y2="6"/>
                                <path d="M16 10a4 4 0 0 1-8 0"/>
                            </svg>
                        </div>
                        <div className={styles.statContent}>
                            <h3>Total Orders</h3>
                            <p className={styles.statNumber}>{stats?.total_orders || 0}</p>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="12" y1="1" x2="12" y2="23"/>
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                            </svg>
                        </div>
                        <div className={styles.statContent}>
                            <h3>Total Revenue</h3>
                            <p className={styles.statNumber}>{formatCurrency(stats?.total_revenue || 0)}</p>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                            </svg>
                        </div>
                        <div className={styles.statContent}>
                            <h3>Pending Orders</h3>
                            <p className={styles.statNumber}>{stats?.pending_orders || 0}</p>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                            </svg>
                        </div>
                        <div className={styles.statContent}>
                            <h3>Average Order</h3>
                            <p className={styles.statNumber}>{formatCurrency(stats?.average_order_value || 0)}</p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className={styles.section}>
                    <h2>Quick Actions</h2>
                    <div className={styles.actionsGrid}>
                        <Link href="/admin/orders" className={styles.actionCard}>
                            <div className={styles.actionIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                                    <line x1="3" y1="6" x2="21" y2="6"/>
                                    <path d="M16 10a4 4 0 0 1-8 0"/>
                                </svg>
                            </div>
                            <h3>Manage Orders</h3>
                            <p>View and update order status</p>
                        </Link>

                        <Link href="/admin/products" className={styles.actionCard}>
                            <div className={styles.actionIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                    <circle cx="9" cy="9" r="2"/>
                                    <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                                </svg>
                            </div>
                            <h3>Manage Products</h3>
                            <p>Add, edit, and remove products</p>
                        </Link>
                    </div>
                </div>

                {/* Order Status Breakdown */}
                {stats?.status_breakdown && (
                    <div className={styles.section}>
                        <h2>Order Status Breakdown</h2>
                        <div className={styles.statusGrid}>
                            {Object.entries(stats.status_breakdown).map(([status, count]) => (
                                <div key={status} className={styles.statusCard}>
                                    <div className={`${styles.statusIndicator} ${styles[status]}`}></div>
                                    <div className={styles.statusContent}>
                                        <h4>{status.replace('_', ' ').toUpperCase()}</h4>
                                        <p>{count} orders</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Activity */}
                <div className={styles.section}>
                    <h2>System Overview</h2>
                    <div className={styles.overviewGrid}>
                        <div className={styles.overviewCard}>
                            <h3>Payment Confirmed</h3>
                            <p className={styles.overviewNumber}>{stats?.payment_confirmed_count || 0}</p>
                            <span className={styles.overviewLabel}>Orders with confirmed payments</span>
                        </div>
                        <div className={styles.overviewCard}>
                            <h3>Recent Orders</h3>
                            <p className={styles.overviewNumber}>{stats?.recent_orders_count || 0}</p>
                            <span className={styles.overviewLabel}>Orders in the last 7 days</span>
                        </div>
                        <div className={styles.overviewCard}>
                            <h3>Completed Orders</h3>
                            <p className={styles.overviewNumber}>{stats?.completed_orders || 0}</p>
                            <span className={styles.overviewLabel}>Successfully delivered orders</span>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedAdminRoute>
    )
}