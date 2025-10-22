'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from "@/components/ProtectedRoute"
import { userCartStore } from '@/store/cartStore'
import { ordersAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import styles from './cart.module.css'

export default function CartPage() {
    const router = useRouter()
    const { items, total, loading, fetchCart, updateItem, removeItem, clearCart } = userCartStore()
    const [checkoutLoading, setCheckoutLoading] = useState(false)
    const [updatingItems, setUpdatingItems] = useState(new Set())

    useEffect(() => {
        fetchCart()
    }, [fetchCart])

    // Debug: Log cart items structure
    useEffect(() => {
        if (items.length > 0) {
            console.log('Cart items structure:', items)
            console.log('First item:', items[0])
            console.log('First item keys:', Object.keys(items[0]))
            if (items[0].product) {
                console.log('First item product:', items[0].product)
                console.log('First item product keys:', Object.keys(items[0].product))
            }
        }
    }, [items])

    const handleQuantityChange = async (productId, newQuantity) => {
        console.log('Updating quantity:', { productId, newQuantity }) // Debug log
        
        if (newQuantity < 1) {
            handleRemoveItem(productId)
            return
        }

        // Add loading state for this specific item
        setUpdatingItems(prev => new Set(prev).add(productId))

        try {
            await updateItem(productId, newQuantity)
            toast.success('Quantity updated')
        } catch (error) {
            console.error('Quantity update error:', error)
            toast.error('Failed to update quantity: ' + error.message)
        } finally {
            // Remove loading state for this item
            setUpdatingItems(prev => {
                const newSet = new Set(prev)
                newSet.delete(productId)
                return newSet
            })
        }
    }

    const handleRemoveItem = async (productId) => {
        const success = await removeItem(productId)
        if (success) {
            toast.success('Item removed from cart')
        } else {
            toast.error('Failed to remove item')
        }
    }

    const handleClearCart = async () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            const success = await clearCart()
            if (success) {
                toast.success('Cart cleared')
            } else {
                toast.error('Failed to clear cart')
            }
        }
    }

    const handleCheckout = async () => {
        if (items.length === 0) {
            toast.error('Your cart is empty')
            return
        }

        setCheckoutLoading(true)
        try {
            const orderData = {
                items: items.map(item => ({
                    product_id: item.product_id || item.id,
                    quantity: item.quantity || 1,
                    price: item.price || 0
                })),
                total: total
            }

            const order = await ordersAPI.create(orderData)
            toast.success('Order placed successfully!')
            router.push(`/orders/${order.id}`)
        } catch (error) {
            console.error('Checkout error:', error)
            toast.error('Failed to place order. Please try again.')
        } finally {
            setCheckoutLoading(false)
        }
    }

    if (loading) {
        return (
            <ProtectedRoute>
                <div className={styles.cartPage}>
                    <div className={styles.container}>
                        <div className={styles.loading}>
                            <div className={styles.spinner}></div>
                            <p>Loading your cart...</p>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        )
    }

    return (
        <ProtectedRoute>
            <div className={styles.cartPage}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Shopping Cart</h1>
                        {items.length > 0 && (
                            <button 
                                className={styles.clearButton}
                                onClick={handleClearCart}
                            >
                                Clear Cart
                            </button>
                        )}
                    </div>

                    {items.length === 0 ? (
                        <div className={styles.emptyCart}>
                            <div className={styles.emptyIcon}>
                                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                                    <line x1="3" y1="6" x2="21" y2="6"/>
                                    <path d="M16 10a4 4 0 0 1-8 0"/>
                                </svg>
                            </div>
                            <h2>Your cart is empty</h2>
                            <p>Add some products to get started</p>
                            <button 
                                className={styles.shopButton}
                                onClick={() => router.push('/products')}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className={styles.cartContent}>
                            <div className={styles.cartItems}>
                                {items.map((item) => {
                                    // Handle flat cart item structure from your backend
                                    const productId = item.product_id || item.id
                                    const productName = item.product_name || item.name || 'Unknown Product'
                                    const productPrice = item.price || 0
                                    const productImage = item.image_url || item.image
                                    const productDescription = item.description || ''
                                    const quantity = item.quantity || 1
                                    
                                    // Skip if we don't have essential data
                                    if (!productId) {
                                        console.warn('Invalid cart item:', item)
                                        return null
                                    }
                                    
                                    return (
                                        <div key={productId} className={styles.cartItem}>
                                            <div className={styles.itemImage}>
                                                <img 
                                                    src={productImage || '/placeholder-product.svg'} 
                                                    alt={productName}
                                                    onError={(e) => {
                                                        e.target.src = '/placeholder-product.svg'
                                                    }}
                                                />
                                            </div>
                                            
                                            <div className={styles.itemDetails}>
                                                <h3 className={styles.itemName}>{productName}</h3>
                                                <p className={styles.itemDescription}>{productDescription}</p>
                                                <div className={styles.itemPrice}>
                                                    ₦{productPrice.toFixed(2)}
                                                </div>
                                            </div>

                                            <div className={styles.itemActions}>
                                                <div className={styles.quantityControl}>
                                                    <button 
                                                        className={styles.quantityButton}
                                                        onClick={() => {
                                                            // Find current quantity from store
                                                            const currentItem = items.find(i => i.product_id === productId)
                                                            const currentQty = currentItem?.quantity || 1
                                                            handleQuantityChange(productId, currentQty - 1)
                                                        }}
                                                        disabled={updatingItems.has(productId)}
                                                    >
                                                        {updatingItems.has(productId) ? '...' : '-'}
                                                    </button>
                                                    <span className={styles.quantity}>{quantity}</span>
                                                    <button 
                                                        className={styles.quantityButton}
                                                        onClick={() => {
                                                            // Find current quantity from store
                                                            const currentItem = items.find(i => i.product_id === productId)
                                                            const currentQty = currentItem?.quantity || 1
                                                            handleQuantityChange(productId, currentQty + 1)
                                                        }}
                                                        disabled={updatingItems.has(productId)}
                                                    >
                                                        {updatingItems.has(productId) ? '...' : '+'}
                                                    </button>
                                                </div>
                                                
                                                <div className={styles.itemTotal}>
                                                    ₦{(productPrice * quantity).toFixed(2)}
                                                </div>
                                                
                                                <button 
                                                    className={styles.removeButton}
                                                    onClick={() => handleRemoveItem(productId)}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <polyline points="3 6 5 6 21 6"/>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                                        <line x1="10" y1="11" x2="10" y2="17"/>
                                                        <line x1="14" y1="11" x2="14" y2="17"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )
                                }).filter(Boolean)}
                            </div>

                            <div className={styles.cartSummary}>
                                <div className={styles.summaryCard}>
                                    <h3 className={styles.summaryTitle}>Order Summary</h3>
                                    
                                    <div className={styles.summaryRow}>
                                        <span>Subtotal ({items.length} items)</span>
                                        <span>₦{total.toFixed(2)}</span>
                                    </div>
                                    
                                    <div className={styles.summaryRow}>
                                        <span>Shipping</span>
                                        <span>Free</span>
                                    </div>
                                    
                                    <div className={styles.summaryRow}>
                                        <span>Tax</span>
                                        <span>₦{(total * 0.08).toFixed(2)}</span>
                                    </div>
                                    
                                    <div className={styles.summaryDivider}></div>
                                    
                                    <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                                        <span>Total</span>
                                        <span>₦{(total * 1.08).toFixed(2)}</span>
                                    </div>
                                    
                                    <button 
                                        className={styles.checkoutButton}
                                        onClick={handleCheckout}
                                        disabled={checkoutLoading}
                                    >
                                        {checkoutLoading ? (
                                            <>
                                                <div className={styles.buttonSpinner}></div>
                                                Processing...
                                            </>
                                        ) : (
                                            'Proceed to Checkout'
                                        )}
                                    </button>
                                    
                                    <button 
                                        className={styles.continueButton}
                                        onClick={() => router.push('/products')}
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    )
}