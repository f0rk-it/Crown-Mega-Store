'use client'

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { productsAPI, recommendationsAPI } from "@/lib/api"
import { useAuthStore } from "@/store/authStore"
import { userCartStore } from "@/store/cartStore"
import ProductCard from "@/components/ProductCard"
import toast from "react-hot-toast"
import styles from './product-detail.module.css'

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { isAuthenticated } = useAuthStore()
    const { addItem } = userCartStore()

    const [product, setProduct] = useState(null)
    const [similarProducts, setSimilarProducts] = useState([])
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(true)
    const [addingToCart, setAddingToCart] = useState(false)
    const [selectedImage, setSelectedImage] = useState(0)

    useEffect(() => {
        if (params.id) {
            fetchProduct()
            fetchSimilarProducts()
        }
    }, [params.id])

    const fetchProduct = async () => {
        setLoading(true)
        try {
            const data = await productsAPI.getById(params.id)
            setProduct(data)

            // Track view activity
            if (isAuthenticated) {
                try {
                    await recommendationsAPI.trackActivity(params.id, 'view')
                } catch (error) {
                    // Silently fail
                }
            }
        } catch (error) {
            console.error('Error fetching product:', error)
            toast.error('Product not found')
            router.push('/products')
        } finally {
            setLoading(false)
        }
    }

    const fetchSimilarProducts = async () => {
        try {
            const data = await recommendationsAPI.getSimilar(params.id, 4)
            setSimilarProducts(data || [])
        } catch (error) {
            console.error('Error fetching similar products:', error)
        }
    }

    const handleAddToCart = async () => {
        setAddingToCart(true)
        try {
            await addItem(product.id, quantity)
            
            toast.success(`${product.name} added to cart!`)

            // Track add to cart activity
            try {
                await recommendationsAPI.trackActivity(product.id, 'add_to_cart')
            } catch (error) {
                // Silently fail tracking
            }
        } catch (error) {
            console.error('Add to cart error:', error)
            
            // Handle authentication errors specifically
            if (error.message?.includes('sign in')) {
                toast.error(error.message)
                router.push(`/auth/signin?redirect=/products/${params.id}`)
            } else {
                toast.error(error.message || 'Failed to add to cart')
            }
        } finally {
            setAddingToCart(false)
        }
    }

    const handleBuyNow = async () => {
        await handleAddToCart()
        if (isAuthenticated) {
            router.push('/cart')
        }
    }

    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.loadingState}>
                        <div className="spinner"></div>
                        <p>Loading product...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!product) {
        return null
    }

    const images = product.image_url ? [product.image_url] : ['https://via.placeholder.com/400x400?text=No+Image']

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* Breadcrumb */}
                <nav className={styles.breadcrumb}>
                    <Link href='/'>Home</Link>
                    <span>/</span>
                    <Link href='/products'>Products</Link>
                    <span>/</span>
                    <Link href={`/products?category=${product.category}`}>{product.category}</Link>
                    <span>/</span>
                    <span>{product.name}</span>
                </nav>

                {/* Product Details Section */}
                <div className={styles.productSection}>
                    {/* Image Gallery */}
                    <div className={styles.imageGallery}>
                        <div className={styles.mainImage}>
                            <img src={images[selectedImage]} alt={product.name} />

                            {/* Badges */}
                            <div className={styles.badges}>
                                {product.is_new && <span className={styles.badge}>New</span>}
                                {product.is_featured && <span className={`${styles.badge} ${styles.featured}`}>Featured</span>}
                                {product.stock_quantity === 0 && <span className={`${styles.badge} ${styles.outOfStock}`}>Out of Stock</span>}
                            </div>
                        </div>

                        {images.length > 1 && (
                            <div className={styles.thumbnails}>
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        className={`${styles.thumbnail} ${selectedImage === index ? styles.active : ''}`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <img src={img}  alt={`${product.name} ${index + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className={styles.productInfo}>
                        <h1 className={styles.productName}>{product.name}</h1>

                        <div className={styles.metaInfo}>
                            <div className={styles.category}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M20 7h-9"/>
                                    <path d="M14 17H5"/>
                                    <circle cx="17" cy="17" r="3"/>
                                    <circle cx="7" cy="7" r="3"/>
                                </svg>
                                <Link href={`/products?category=${product.category}`}>{product.category}</Link>
                            </div>

                            {product.rating > 0 && (
                                <div className={styles.rating}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-primary)" stroke="none">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <span>{parseFloat(product.rating).toFixed(1)}</span>
                                    <span className={styles.ratingCount}>({product.order_count} reviews)</span>
                                </div>
                            )}
                        </div>

                        <div className={styles.price}>
                            <span className={styles.priceValue}>₦{parseFloat(product.price).toFixed(2)}</span>
                            {product.stock_quantity > 0 && product.stock_quantity <= 10 && (
                                <span className={styles.lowStock}>Only {product.stock_quantity} left in stock!</span>
                            )}
                        </div>

                        <p className={styles.description}>{product.description || 'No description available.'}</p>

                        {/* Quantity Selector */}
                        {product.stock_quantity > 0 && (
                            <div className={styles.quantitySection}>
                                <label className={styles.quantityLabel}>Quantity:</label>
                                <div className={styles.quantitySelector}>
                                    <button
                                        className={styles.quantityButton}
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        min='1'
                                        max={product.stock_quantity}
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock_quantity, parseInt(e.target.value) || 1)))}
                                        className={styles.quantityInput}
                                    />
                                    <button
                                        className={styles.quantityButton}
                                        onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                                        disabled={quantity >= product.stock_quantity}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className={styles.actions}>
                            {product.stock_quantity > 0 ? (
                                <>
                                    <button
                                        className={styles.addToCartButton}
                                        onClick={handleAddToCart}
                                        disabled={addingToCart}
                                    >
                                        {addingToCart ? (
                                            <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                                        ) : (
                                            <>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                                                    <line x1="3" y1="6" x2="21" y2="6"/>
                                                    <path d="M16 10a4 4 0 0 1-8 0"/>
                                                </svg>
                                                Add to Cart
                                            </>
                                        )}
                                    </button>
                                    <button
                                        className={styles.buyNowButton}
                                        onClick={handleBuyNow}
                                        disabled={addingToCart}
                                    >
                                        Buy Now
                                    </button>
                                </>
                            ) : (
                                <button className={styles.outOfStockButton} disabled>
                                    Out of Stock
                                </button>
                            )}
                        </div>

                        {/* Product Features */}
                        <div className={styles.features}>
                            <div className={styles.feature}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                </svg>
                                <span>Secure Payment</span>
                            </div>
                            <div className={styles.feature}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <rect x="1" y="3" width="15" height="13"/>
                                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                                    <circle cx="5.5" cy="18.5" r="2.5"/>
                                    <circle cx="18.5" cy="18.5" r="2.5"/>
                                </svg>
                                <span>Fast Delivery</span>
                            </div>
                            <div className={styles.feature}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                    <circle cx="12" cy="7" r="4"/>
                                </svg>
                                <span>24/7 Support</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <ReviewSection product={product} />

                {/* Similar Products */}
                {similarProducts.length > 0 && (
                    <section className={styles.similarSection}>
                        <h2 className={styles.sectionTitle}>You May Also Like</h2>
                        <div className={styles.similarGrid}>
                            {similarProducts.map((prod, index) => (
                                <ProductCard key={prod.id} product={prod} index={index} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}

// Reviews Component
function ReviewSection({ product }) {
    //TODO: Mock reviews for now (you can add a reviews table to databse later)
    const mockReviews = product.order_count > 0 ? [
        {
            id: 1,
            author: 'John D.',
            rating: 5,
            date: '2 weeks ago',
            comment: 'Excellent product! Exactly as described. Very happy with my purchase.'
        },
        {
            id: 2,
            author: 'Sarah M.',
            rating: 4,
            date: '1 month ago',
            comment: 'Good quality, fast shipping. Would recommend!'
        }
    ] : []

    return (
        <section className={styles.reviewsSection}>
        <h2 className={styles.sectionTitle}>Customer Reviews</h2>
        
        {product.rating > 0 && (
            <div className={styles.reviewsSummary}>
            <div className={styles.overallRating}>
                <span className={styles.ratingNumber}>{parseFloat(product.rating).toFixed(1)}</span>
                <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                    <svg
                    key={i}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={i < Math.floor(product.rating) ? 'var(--color-primary)' : 'none'}
                    stroke="var(--color-primary)"
                    >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                ))}
                </div>
                <span className={styles.reviewCount}>Based on {product.order_count} reviews</span>
            </div>
            </div>
        )}

        {mockReviews.length > 0 ? (
            <div className={styles.reviewsList}>
            {mockReviews.map((review) => (
                <div key={review.id} className={styles.review}>
                <div className={styles.reviewHeader}>
                    <div>
                    <span className={styles.reviewAuthor}>{review.author}</span>
                    <span className={styles.reviewDate}>{review.date}</span>
                    </div>
                    <div className={styles.reviewStars}>
                    {[...Array(5)].map((_, i) => (
                        <svg
                        key={i}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill={i < review.rating ? 'var(--color-primary)' : 'none'}
                        stroke="var(--color-primary)"
                        >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                    ))}
                    </div>
                </div>
                <p className={styles.reviewComment}>{review.comment}</p>
                </div>
            ))}
            </div>
        ) : (
            <div className={styles.noReviews}>
            <p>No reviews yet. Be the first to review this product!</p>
            </div>
        )}
    </section>
    )
}