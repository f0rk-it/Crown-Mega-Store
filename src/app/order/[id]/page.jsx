'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ordersAPI } from '@/lib/api'
import Link from 'next/link'
import styles from './order.module.css'

export default function OrderPage() {
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
            'pending': 'Order Pending',
            'confirmed': 'Order Confirmed',
            'payment_received': 'Payment Received',
            'processing': 'Processing',
            'shipped': 'Shipped',
            'delivered': 'Delivered',
            'cancelled': 'Cancelled'
        }
        return statusTexts[status] || status
    }

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading order details...</p>
                </div>
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <div className={styles.errorIcon}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                    </div>
                    <h2>Order Not Found</h2>
                    <p>{error || 'The order you are looking for does not exist or has been removed.'}</p>
                    <Link href="/" className={styles.homeButton}>
                        Go Back Home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.successIcon}>
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22,4 12,14.01 9,11.01"/>
                    </svg>
                </div>
                <h1>Order Confirmed!</h1>
                <p>Thank you for your order. We'll process it shortly.</p>
            </div>

            <div className={styles.orderDetails}>
                <div className={styles.orderInfo}>
                    <div className={styles.infoSection}>
                        <h2>Order Information</h2>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Order ID:</span>
                                <span className={styles.value}>{order.order_id}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Order Date:</span>
                                <span className={styles.value}>{formatDate(order.created_at)}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Status:</span>
                                <span 
                                    className={styles.status}
                                    style={{ backgroundColor: getStatusColor(order.status) }}
                                >
                                    {getStatusText(order.status)}
                                </span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Total:</span>
                                <span className={styles.value + ' ' + styles.total}>{formatPrice(order.total)}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.infoSection}>
                        <h2>Customer Information</h2>
                        <div className={styles.customerInfo}>
                            <p><strong>Name:</strong> {order.customer_name}</p>
                            <p><strong>Email:</strong> {order.customer_email}</p>
                            <p><strong>Phone:</strong> {order.customer_phone}</p>
                            {order.delivery_address && (
                                <p><strong>Delivery Address:</strong> {order.delivery_address}</p>
                            )}
                            {order.pickup_preference && (
                                <p><strong>Pickup:</strong> Store pickup preferred</p>
                            )}
                            {order.order_notes && (
                                <p><strong>Notes:</strong> {order.order_notes}</p>
                            )}
                            <p><strong>Payment Method:</strong> {order.payment_preference?.replace('_', ' ').toUpperCase()}</p>
                        </div>
                    </div>

                    {order.items && order.items.length > 0 && (
                        <div className={styles.infoSection}>
                            <h2>Order Items</h2>
                            <div className={styles.orderItems}>
                                {order.items.map((item, index) => (
                                    <div key={index} className={styles.orderItem}>
                                        <div className={styles.itemDetails}>
                                            <h4>{item.product_name}</h4>
                                            <p>Quantity: {item.quantity}</p>
                                            <p>Price: {formatPrice(item.price)}</p>
                                        </div>
                                        <div className={styles.itemTotal}>
                                            {formatPrice(item.price * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.nextSteps}>
                    <div className={styles.stepsSection}>
                        <h2>What's Next?</h2>
                        <div className={styles.steps}>
                            <div className={styles.step}>
                                <div className={styles.stepNumber}>1</div>
                                <div className={styles.stepContent}>
                                    <h3>Order Confirmation</h3>
                                    <p>You'll receive an email confirmation shortly with your order details.</p>
                                </div>
                            </div>
                            <div className={styles.step}>
                                <div className={styles.stepNumber}>2</div>
                                <div className={styles.stepContent}>
                                    <h3>Processing</h3>
                                    <p>We'll prepare your order and confirm payment details if needed.</p>
                                </div>
                            </div>
                            <div className={styles.step}>
                                <div className={styles.stepNumber}>3</div>
                                <div className={styles.stepContent}>
                                    <h3>Delivery</h3>
                                    <p>{order.pickup_preference ? 'We\'ll notify you when your order is ready for pickup.' : 'Your order will be delivered to your specified address.'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.contactInfo}>
                        <h3>Need Help?</h3>
                        <p>If you have any questions about your order, please contact us:</p>
                        <div className={styles.contactDetails}>
                            <p>📞 +234 123 456 7890</p>
                            <p>📧 orders@crownmegastore.com</p>
                            <p>💬 WhatsApp: +234 801 234 5678</p>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <Link href="/shop" className={styles.continueButton}>
                            Continue Shopping
                        </Link>
                        <Link href={`/track/${order.order_id}`} className={styles.trackButton}>
                            Track Order
                        </Link>
                        <button 
                            className={styles.printButton}
                            onClick={() => window.print()}
                        >
                            Print Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}