'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ordersAPI } from '@/lib/api'
import Link from 'next/link'
import toast from 'react-hot-toast'
import styles from './track.module.css'

export default function OrderTrackingPage() {
    const params = useParams()
    const router = useRouter()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (params.id) {
            fetchOrder(params.id)
        }
    }, [params.id])

    const fetchOrder = async (orderId) => {
        try {
            setLoading(true)
            setError(null)
            const orderData = await ordersAPI.getById(orderId)
            setOrder(orderData)
        } catch (error) {
            console.error('Fetch order error:', error)
            setError('Order not found or invalid order ID')
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
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusIcon = (status, isCompleted = false) => {
        if (isCompleted) {
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="m9 12 2 2 4-4"/>
                    <circle cx="12" cy="12" r="10"/>
                </svg>
            )
        }
        
        switch (status) {
            case 'pending':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12,6 12,12 16,14"/>
                    </svg>
                )
            case 'confirmed':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="m9 12 2 2 4-4"/>
                        <circle cx="12" cy="12" r="10"/>
                    </svg>
                )
            case 'payment_received':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                        <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                )
            case 'processing':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91-6.91a6 6 0 0 1 7.94-7.94l3.77 3.77z"/>
                    </svg>
                )
            case 'shipped':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>
                    </svg>
                )
            case 'delivered':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 7v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7"/>
                        <path d="M21 7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v0a2 2 0 0 1 2 2h12a2 2 0 0 1 2-2v0z"/>
                    </svg>
                )
            default:
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10"/>
                    </svg>
                )
        }
    }

    const getTrackingSteps = (currentStatus) => {
        const allSteps = [
            {
                key: 'pending',
                title: 'Order Placed',
                description: 'Your order has been placed and is awaiting confirmation.',
                estimatedTime: '0-2 hours'
            },
            {
                key: 'confirmed',
                title: 'Order Confirmed',
                description: 'Your order has been confirmed and is being prepared.',
                estimatedTime: '2-4 hours'
            },
            {
                key: 'payment_received',
                title: 'Payment Received',
                description: 'Payment has been confirmed and processed.',
                estimatedTime: '1-24 hours'
            },
            {
                key: 'processing',
                title: 'Processing',
                description: 'Your order is being prepared for shipment.',
                estimatedTime: '1-2 days'
            },
            {
                key: 'shipped',
                title: 'Shipped',
                description: order?.pickup_preference ? 'Your order is ready for pickup.' : 'Your order is on its way to you.',
                estimatedTime: order?.pickup_preference ? 'Ready now' : '1-3 days'
            },
            {
                key: 'delivered',
                title: 'Delivered',
                description: order?.pickup_preference ? 'Order has been picked up.' : 'Order has been delivered.',
                estimatedTime: 'Complete'
            }
        ]

        const statusOrder = ['pending', 'confirmed', 'payment_received', 'processing', 'shipped', 'delivered']
        const currentIndex = statusOrder.indexOf(currentStatus)

        return allSteps.map((step, index) => ({
            ...step,
            isCompleted: index <= currentIndex,
            isCurrent: index === currentIndex,
            isUpcoming: index > currentIndex
        }))
    }

    const getEstimatedDelivery = (status) => {
        const estimatedDays = {
            'pending': 5,
            'confirmed': 4,
            'payment_received': 3,
            'processing': 3,
            'shipped': 1,
            'delivered': 0
        }

        const days = estimatedDays[status] || 5
        if (days === 0) return 'Delivered'

        const deliveryDate = new Date()
        deliveryDate.setDate(deliveryDate.getDate() + days)
        
        return deliveryDate.toLocaleDateString('en-NG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading order tracking information...</p>
                </div>
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <div className={styles.errorIcon}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                    </div>
                    <h2>Order Not Found</h2>
                    <p>{error || 'The order you\'re looking for doesn\'t exist or has been removed.'}</p>
                    <div className={styles.errorActions}>
                        <Link href="/account/orders" className={styles.ordersButton}>
                            View My Orders
                        </Link>
                        <Link href="/shop" className={styles.shopButton}>
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const trackingSteps = getTrackingSteps(order.status)

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Track Your Order</h1>
                <p>Order ID: <span className={styles.orderId}>{order.order_id}</span></p>
            </div>

            <div className={styles.trackingCard}>
                <div className={styles.orderSummary}>
                    <div className={styles.summaryHeader}>
                        <h2>Order Summary</h2>
                        <div className={styles.orderMeta}>
                            <span>Placed on {formatDate(order.created_at)}</span>
                            <span className={styles.totalAmount}>{formatPrice(order.total)}</span>
                        </div>
                    </div>

                    <div className={styles.deliveryInfo}>
                        <div className={styles.deliveryType}>
                            <strong>{order.pickup_preference ? '🏪 Store Pickup' : '🚚 Home Delivery'}</strong>
                            {!order.pickup_preference && order.delivery_address && (
                                <p className={styles.address}>{order.delivery_address}</p>
                            )}
                        </div>
                        <div className={styles.estimatedDelivery}>
                            <span className={styles.estimatedLabel}>
                                {order.pickup_preference ? 'Estimated Ready By:' : 'Estimated Delivery:'}
                            </span>
                            <span className={styles.estimatedDate}>{getEstimatedDelivery(order.status)}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.trackingTimeline}>
                    <h2>Order Status</h2>
                    <div className={styles.timeline}>
                        {trackingSteps.map((step, index) => (
                            <div 
                                key={step.key} 
                                className={`${styles.timelineStep} ${
                                    step.isCompleted ? styles.completed : 
                                    step.isCurrent ? styles.current : styles.upcoming
                                }`}
                            >
                                <div className={styles.stepIcon}>
                                    {getStatusIcon(step.key, step.isCompleted)}
                                </div>
                                <div className={styles.stepContent}>
                                    <h3>{step.title}</h3>
                                    <p>{step.description}</p>
                                    {step.isCurrent && (
                                        <span className={styles.estimatedTime}>
                                            Next update: {step.estimatedTime}
                                        </span>
                                    )}
                                </div>
                                {index < trackingSteps.length - 1 && (
                                    <div className={styles.stepConnector}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {order.order_items && order.order_items.length > 0 && (
                    <div className={styles.orderItems}>
                        <h2>Order Items</h2>
                        <div className={styles.itemsList}>
                            {order.order_items.slice(0, 3).map((item, index) => (
                                <div key={index} className={styles.orderItem}>
                                    <div className={styles.itemInfo}>
                                        <h4>{item.product_name}</h4>
                                        <p>Qty: {item.quantity} × {formatPrice(item.price)}</p>
                                    </div>
                                    <div className={styles.itemTotal}>
                                        {formatPrice(item.price * item.quantity)}
                                    </div>
                                </div>
                            ))}
                            {order.order_items.length > 3 && (
                                <p className={styles.moreItems}>
                                    +{order.order_items.length - 3} more item{order.order_items.length - 3 > 1 ? 's' : ''}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.supportSection}>
                <div className={styles.supportCard}>
                    <h2>Need Help?</h2>
                    <p>If you have any questions about your order, please don't hesitate to contact us.</p>
                    <div className={styles.contactMethods}>
                        <div className={styles.contactMethod}>
                            <strong>📞 Phone</strong>
                            <span>+234 123 456 7890</span>
                        </div>
                        <div className={styles.contactMethod}>
                            <strong>📧 Email</strong>
                            <span>orders@crownmegastore.com</span>
                        </div>
                        <div className={styles.contactMethod}>
                            <strong>💬 WhatsApp</strong>
                            <span>+234 801 234 5678</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.actions}>
                <Link href={`/order/${order.order_id}`} className={styles.viewDetailsButton}>
                    View Full Details
                </Link>
                <Link href="/shop" className={styles.continueButton}>
                    Continue Shopping
                </Link>
                <button 
                    className={styles.refreshButton}
                    onClick={() => fetchOrder(params.id)}
                >
                    Refresh Status
                </button>
            </div>
        </div>
    )
}