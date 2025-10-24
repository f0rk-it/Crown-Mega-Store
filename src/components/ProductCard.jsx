'use client'

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { userCartStore } from "@/store/cartStore"
import { useAuthStore } from "@/store/authStore"
import OptimizedImage from './OptimizedImage'
import toast from "react-hot-toast"
import styles from '../styles/productCard.module.css'

export default function ProductCard({ product, index }) {
    const [addingToCart, setAddingToCart] = useState(false)
    const { addItem } = userCartStore()
    const { isAuthenticated } = useAuthStore()
    const router = useRouter()

    const handleAddToCart = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        
        setAddingToCart(true)
        try {
            await addItem(product.id, 1)
            toast.success(`${product.name} added to cart!`)
        } catch (error) {
            console.error('Add to cart error:', error)
            
            // Handle authentication errors specifically
            if (error.message?.includes('sign in')) {
                toast.error(error.message)
                router.push(`/auth/signin?redirect=/products/${product.id}`)
            } else {
                toast.error(error.message || 'Failed to add to cart')
            }
        } finally {
            setAddingToCart(false)
        }
    }

    return (
        <Link
            href={`/products/${product.id}`}
            className={styles.card}
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <div className={styles.imageWrapper}>
                <OptimizedImage
                    src={product.image_url}
                    alt={product.name}
                    size="card"
                    className={styles.image}
                    fallback="https://via.placeholder.com/400"
                />

                {/* Badges */}
                <div className={styles.badges}>
                    {product.is_new && <span className={styles.badge}>New</span>}
                    {product.is_featured && <span className={`${styles.badge} ${styles.featured}`}>Featured</span>}
                    {product.stock_quantity === 0 && <span className={`${styles.badge} ${styles.outOfStock}`}>Out of Stock</span>}
                </div>

                {/* Quick Actions */}
                <div className={styles.quickActions}>
                    <button
                        className={styles.quickAction}
                        onClick={handleAddToCart}
                        disabled={product.stock_quantity === 0 || addingToCart}
                    >
                        {addingToCart ? (
                            <div className={styles.spinner}></div>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                                <line x1="3" y1="6" x2="21" y2="6"/>
                                <path d="M16 10a4 4 0 0 1-8 0"/>
                            </svg>
                        )}
                    </button>
                    <button className={styles.quickAction}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                    </button>
                </div>
            </div>

            <div className={styles.info}>
                <p className={styles.category}>{product.category}</p>
                <h3 className={styles.name}>{product.name}</h3>
                <p className={styles.description}>
                    {product.description?.substring(0, 80) || 'No description available'}...
                </p>

                <div className={styles.footer}>
                    <div className={styles.priceSection}>
                        <span className={styles.price}>₦{parseFloat(product.price).toFixed(2)}</span>
                        {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                            <span className={styles.lowStock}>Only {product.stock_quantity} left</span>
                        )}
                    </div>

                    {product.rating > 0 && (
                        <div className={styles.rating}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-primary)" stroke="none">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            <span>{parseFloat(product.rating).toFixed(1)}</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    )
}