'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { userCartStore } from '@/store/cartStore'
import { ordersAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import styles from './checkout.module.css'

export default function CheckoutPage() {
    const router = useRouter()
    const { isAuthenticated, user } = useAuthStore()
    const { items: cartItems, total: cartTotal, clearCart } = userCartStore()
    
    const [customerInfo, setCustomerInfo] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        delivery_address: '',
        pickup_preference: false,
        order_notes: '',
        payment_preference: 'bank_transfer'
    })
    
    const [isLoading, setIsLoading] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        // Redirect if cart is empty
        if (!cartItems || cartItems.length === 0) {
            router.push('/cart')
        }
    }, [cartItems, router])

    useEffect(() => {
        // Pre-fill user info if authenticated
        if (isAuthenticated && user) {
            setCustomerInfo(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || ''
            }))
        }
    }, [isAuthenticated, user])

    const validateForm = () => {
        const newErrors = {}

        // Name validation
        if (!customerInfo.name.trim()) {
            newErrors.name = 'Name is required'
        } else if (customerInfo.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters'
        } else if (!/^[a-zA-Z\s]+$/.test(customerInfo.name.trim())) {
            newErrors.name = 'Name can only contain letters and spaces'
        }

        // Email validation
        if (!customerInfo.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
            newErrors.email = 'Please enter a valid email address'
        }

        // Phone validation (Nigerian format)
        if (!customerInfo.phone.trim()) {
            newErrors.phone = 'Phone number is required'
        } else if (!/^(\+?234|0)?[789]\d{9}$/.test(customerInfo.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Please enter a valid Nigerian phone number'
        }

        // Address validation (only if not pickup)
        if (!customerInfo.pickup_preference) {
            if (!customerInfo.delivery_address.trim()) {
                newErrors.delivery_address = 'Delivery address is required'
            } else if (customerInfo.delivery_address.trim().length < 10) {
                newErrors.delivery_address = 'Please provide a detailed address'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (field, value) => {
        setCustomerInfo(prev => ({
            ...prev,
            [field]: value
        }))
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }))
        }
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN'
        }).format(price)
    }

    const prepareOrderData = () => {
        console.log('Cart items before preparation:', cartItems)
        
        // Calculate total
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        
        const orderData = {
            items: cartItems.map(item => ({
                product_id: item.product_id || item.id,
                product_name: item.product_name || item.name,
                quantity: item.quantity,
                price: parseFloat(item.price)
            })),
            customer_info: {
                name: customerInfo.name.trim(),
                email: customerInfo.email.trim(), // Required by API validation even if not stored in DB
                phone: customerInfo.phone.replace(/\s/g, ''),
                delivery_address: customerInfo.pickup_preference ? null : (customerInfo.delivery_address ? customerInfo.delivery_address.trim() : null),
                pickup_preference: Boolean(customerInfo.pickup_preference),
                order_notes: customerInfo.order_notes ? customerInfo.order_notes.trim() : null,
                payment_preference: customerInfo.payment_preference || 'bank_transfer'
            }
        }
        
        console.log('Prepared order data:', orderData)
        return orderData
    }

    const handlePlaceOrder = async () => {
        if (!validateForm()) {
            toast.error('Please fix the errors and try again')
            return
        }

        setShowConfirmation(true)
    }

    const confirmOrder = async () => {
        setIsLoading(true)
        try {
            const orderData = prepareOrderData()
            console.log('Checkout: Sending order data:', JSON.stringify(orderData, null, 2))
            console.log('Checkout: Auth status:', isAuthenticated)
            console.log('Checkout: User:', user)
            console.log('Checkout: Auth token:', localStorage.getItem('authToken'))
            
            const response = await ordersAPI.checkout(orderData)
            console.log('Checkout: API response:', response)
            
            if (response.success) {
                // Clear cart
                await clearCart()
                
                toast.success('Order placed successfully! Check your email for confirmation.')
                
                // Redirect to order confirmation page
                router.push(`/order/${response.order_id}`)
            } else {
                throw new Error(response.message || 'Failed to place order')
            }
        } catch (error) {
            console.error('Checkout error:', error)
            console.error('Error status:', error.status)
            console.error('Error response:', error.response)
            
            let errorMessage = 'Failed to place order. Please try again.'
            
            if (error.message && error.message !== '[object Object]') {
                errorMessage = error.message
            } else if (error.response) {
                if (typeof error.response === 'string') {
                    errorMessage = error.response
                } else {
                    errorMessage = `Order creation failed: ${JSON.stringify(error.response)}`
                }
            }
            
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
            setShowConfirmation(false)
        }
    }

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyState}>
                    <h2>Your cart is empty</h2>
                    <p>Add some items to your cart to proceed with checkout</p>
                    <button 
                        className={styles.shopButton}
                        onClick={() => router.push('/shop')}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Checkout</h1>
                <p>Complete your order</p>
            </div>

            <div className={styles.checkoutGrid}>
                {/* Customer Information Form */}
                <div className={styles.customerForm}>
                    <div className={styles.section}>
                        <h2>Customer Information</h2>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Full Name *</label>
                            <input
                                type="text"
                                id="name"
                                value={customerInfo.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className={errors.name ? styles.error : ''}
                                placeholder="Enter your full name"
                            />
                            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email Address *</label>
                            <input
                                type="email"
                                id="email"
                                value={customerInfo.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className={errors.email ? styles.error : ''}
                                placeholder="Enter your email address"
                            />
                            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="phone">Phone Number *</label>
                            <input
                                type="tel"
                                id="phone"
                                value={customerInfo.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className={errors.phone ? styles.error : ''}
                                placeholder="+234 xxx xxx xxxx"
                            />
                            {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2>Delivery Options</h2>
                        
                        <div className={styles.deliveryOptions}>
                            <label className={styles.radioOption}>
                                <input
                                    type="radio"
                                    name="delivery"
                                    checked={!customerInfo.pickup_preference}
                                    onChange={() => handleInputChange('pickup_preference', false)}
                                />
                                <span className={styles.radioLabel}>
                                    <strong>Home Delivery</strong>
                                    <span>Get your order delivered to your address</span>
                                </span>
                            </label>

                            <label className={styles.radioOption}>
                                <input
                                    type="radio"
                                    name="delivery"
                                    checked={customerInfo.pickup_preference}
                                    onChange={() => handleInputChange('pickup_preference', true)}
                                />
                                <span className={styles.radioLabel}>
                                    <strong>Store Pickup</strong>
                                    <span>Pick up your order from our store</span>
                                </span>
                            </label>
                        </div>

                        {!customerInfo.pickup_preference && (
                            <div className={styles.formGroup}>
                                <label htmlFor="address">Delivery Address *</label>
                                <textarea
                                    id="address"
                                    value={customerInfo.delivery_address}
                                    onChange={(e) => handleInputChange('delivery_address', e.target.value)}
                                    className={errors.delivery_address ? styles.error : ''}
                                    placeholder="Enter your complete delivery address"
                                    rows={3}
                                />
                                {errors.delivery_address && <span className={styles.errorText}>{errors.delivery_address}</span>}
                            </div>
                        )}
                    </div>

                    <div className={styles.section}>
                        <h2>Additional Information</h2>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="payment">Payment Method</label>
                            <select
                                id="payment"
                                value={customerInfo.payment_preference}
                                onChange={(e) => handleInputChange('payment_preference', e.target.value)}
                            >
                                <option value="bank_transfer">Bank Transfer</option>
                                <option value="cash_on_delivery">Cash on Delivery</option>
                                <option value="pos_on_delivery">POS on Delivery</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="notes">Order Notes (Optional)</label>
                            <textarea
                                id="notes"
                                value={customerInfo.order_notes}
                                onChange={(e) => handleInputChange('order_notes', e.target.value)}
                                placeholder="Any special instructions for your order..."
                                rows={3}
                            />
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className={styles.orderSummary}>
                    <div className={styles.summarySection}>
                        <h2>Order Summary</h2>
                        
                        <div className={styles.orderItems}>
                            {cartItems.map((item) => (
                                <div key={item.product_id} className={styles.orderItem}>
                                    <div className={styles.itemImage}>
                                        <img
                                            src={item.image_url || '/placeholder-product.svg'}
                                            alt={item.product_name || item.name}
                                            onError={(e) => {
                                                e.target.src = '/placeholder-product.svg'
                                            }}
                                        />
                                    </div>
                                    <div className={styles.itemDetails}>
                                        <h4>{item.product_name || item.name}</h4>
                                        <p>Qty: {item.quantity}</p>
                                        <span className={styles.itemPrice}>
                                            {formatPrice(item.price * item.quantity)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.orderTotal}>
                            <div className={styles.totalRow}>
                                <span>Subtotal:</span>
                                <span>{formatPrice(cartTotal)}</span>
                            </div>
                            <div className={styles.totalRow}>
                                <span>Delivery:</span>
                                <span>{customerInfo.pickup_preference ? 'Free' : 'TBD'}</span>
                            </div>
                            <div className={styles.totalRow + ' ' + styles.finalTotal}>
                                <span>Total:</span>
                                <span>{formatPrice(cartTotal)}</span>
                            </div>
                        </div>

                        <button
                            className={styles.placeOrderButton}
                            onClick={handlePlaceOrder}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Placing Order...' : 'Place Order'}
                        </button>

                        <div className={styles.securityNote}>
                            <p>🔒 Your information is secure and encrypted</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h3>Confirm Your Order</h3>
                        <p>Are you sure you want to place this order for {formatPrice(cartTotal)}?</p>
                        
                        <div className={styles.confirmationDetails}>
                            <p><strong>Customer:</strong> {customerInfo.name}</p>
                            <p><strong>Email:</strong> {customerInfo.email}</p>
                            <p><strong>Phone:</strong> {customerInfo.phone}</p>
                            <p><strong>Delivery:</strong> {customerInfo.pickup_preference ? 'Store Pickup' : 'Home Delivery'}</p>
                            <p><strong>Payment:</strong> {customerInfo.payment_preference.replace('_', ' ').toUpperCase()}</p>
                        </div>

                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setShowConfirmation(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.confirmButton}
                                onClick={confirmOrder}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Processing...' : 'Confirm Order'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}