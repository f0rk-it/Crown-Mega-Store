'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { ordersAPI } from '@/lib/api'
import Link from 'next/link'
import toast from 'react-hot-toast'
import styles from './orders.module.css'

export default function MyOrdersPage() {
    const router = useRouter()
    const { isAuthenticated, user, loading: authLoading } = useAuthStore()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedStatus, setSelectedStatus] = useState('')

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated) {
                router.push('/auth/signin?redirect=/account/orders')
                return
            }
            fetchOrders()
        }
    }, [isAuthenticated, authLoading, router, selectedStatus])

    const fetchOrders = async () => {
        try {
            setLoading(true)
            setError(null)
            const ordersData = await ordersAPI.getMyOrders(selectedStatus || null)
            console.log('My orders response:', ordersData)
            
            // Handle different response structures
            const ordersList = Array.isArray(ordersData) ? ordersData : (ordersData.orders || [])
            setOrders(ordersList)
        } catch (error) {
            console.error('Fetch orders error:', error)
            setError('Failed to load orders. Please try again.')
            setOrders([])
        } finally {
            setLoading(false)
        }
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN'
        }).format(price)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusColor = (status) => {
        const statusColors = {
            'pending': '#fbbf24',
            'confirmed': '#3b82f6',
            'payment_received': '#10b981',
            'processing': '#8b5cf6',
            'shipped': '#06b6d4',
            'delivered': '#22c55e',
            'cancelled': '#ef4444'
        }
        return statusColors[status] || '#6b7280'
    }

    const getStatusText = (status) => {
        const statusTexts = {
            'pending': 'Pending',
            'confirmed': 'Confirmed',
            'payment_received': 'Payment Received',
            'processing': 'Processing',
            'shipped': 'Shipped',
            'delivered': 'Delivered',
            'cancelled': 'Cancelled'
        }
        return statusTexts[status] || status
    }

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
                <h1>My Orders</h1>
                <p>Track and manage your orders</p>
            </div>

            <div className={styles.filters}>
                <div className={styles.filterGroup}>
                    <label htmlFor="status">Filter by Status:</label>
                    <select
                        id="status"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className={styles.statusFilter}
                    >
                        <option value="">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="payment_received">Payment Received</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading your orders...</p>
                </div>
            ) : error ? (
                <div className={styles.error}>
                    <div className={styles.errorIcon}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                    </div>
                    <h3>Error Loading Orders</h3>
                    <p>{error}</p>
                    <button 
                        className={styles.retryButton}
                        onClick={fetchOrders}
                    >
                        Try Again
                    </button>
                </div>
            ) : orders.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 0 1-8 0"/>
                        </svg>
                    </div>
                    <h2>No Orders Found</h2>
                    <p>
                        {selectedStatus 
                            ? `You don't have any ${getStatusText(selectedStatus).toLowerCase()} orders.`
                            : "You haven't placed any orders yet."
                        }
                    </p>
                    <Link href="/shop" className={styles.shopButton}>
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className={styles.ordersList}>
                    {orders.map((order) => (
                        <div key={order.id} className={styles.orderCard}>
                            <div className={styles.orderHeader}>
                                <div className={styles.orderInfo}>
                                    <h3>Order {order.order_id}</h3>
                                    <p className={styles.orderDate}>{formatDate(order.created_at)}</p>
                                </div>
                                <div className={styles.orderStatus}>
                                    <span 
                                        className={styles.statusBadge}
                                        style={{ backgroundColor: getStatusColor(order.status) }}
                                    >
                                        {getStatusText(order.status)}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.orderDetails}>
                                <div className={styles.customerInfo}>
                                    <p><strong>Delivery:</strong> {order.pickup_preference ? 'Store Pickup' : 'Home Delivery'}</p>
                                    {order.delivery_address && (
                                        <p><strong>Address:</strong> {order.delivery_address}</p>
                                    )}
                                    <p><strong>Payment:</strong> {order.payment_preference?.replace('_', ' ').toUpperCase()}</p>
                                </div>

                                {order.order_items && order.order_items.length > 0 && (
                                    <div className={styles.orderItems}>
                                        <h4>Items ({order.order_items.length})</h4>
                                        <div className={styles.itemsList}>
                                            {order.order_items.slice(0, 3).map((item, index) => (
                                                <div key={index} className={styles.orderItem}>
                                                    <span className={styles.itemName}>{item.product_name}</span>
                                                    <span className={styles.itemQuantity}>x{item.quantity}</span>
                                                    <span className={styles.itemPrice}>{formatPrice(item.price)}</span>
                                                </div>
                                            ))}
                                            {order.order_items.length > 3 && (
                                                <p className={styles.moreItems}>
                                                    and {order.order_items.length - 3} more item(s)
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={styles.orderFooter}>
                                <div className={styles.orderTotal}>
                                    <span className={styles.totalLabel}>Total:</span>
                                    <span className={styles.totalAmount}>{formatPrice(order.total)}</span>
                                </div>
                                <div className={styles.orderActions}>
                                    <Link 
                                        href={`/order/${order.order_id}`}
                                        className={styles.viewButton}
                                    >
                                        View Details
                                    </Link>
                                    <Link 
                                        href={`/track/${order.order_id}`}
                                        className={styles.trackButton}
                                    >
                                        Track Order
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}