'use client'

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import ProductCard from './ProductCard'
import styles from '../styles/featured.module.css'

export default function FeaturedProducts() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const scrollContainerRef = useRef(null)

    useEffect(() => {
        fetchFeaturedProducts()
    }, [])

    const fetchFeaturedProducts = async () => {
        try {
            const response = await fetch('https://crown-mega-store-backend.onrender.com/api/products/?sort_by=balanced&limit=8')
            const data = await response.json()
            setProducts(data.products || [])
        } catch (error) {
            console.error('Error fetching featured products:', error)
        } finally {
            setLoading(false)
        }
    }

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200
            scrollContainerRef.current.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200
            scrollContainerRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    if (loading) {
        return (
            <section className={styles.section}>
                <div className="container">
                    <div className={styles.header}>
                        <div>
                            <h2 className={styles.title}>Featured Products</h2>
                            <p className={styles.subtitle}>Discover our handpicked selection of amazing products</p>
                        </div>
                    </div>
                    <div className={styles.gridContainer}>
                        <div className={styles.loadingGrid}>
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className={styles.skeleton}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <div>
                        <h2 className={styles.title}>Featured Products</h2>
                        <p className={styles.subtitle}>Discover our handpicked selection of amazing products</p>
                    </div>
                    <Link href='/products' className={styles.viewAll}>
                        View All
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="5" y1="12" x2="19" y2="12"/>
                            <polyline points="12 5 19 12 12 19"/>
                        </svg>
                    </Link>
                </div>

                <div className={styles.gridContainer}>
                    <button 
                        className={`${styles.scrollButton} ${styles.scrollLeft}`}
                        onClick={scrollLeft}
                        aria-label="Scroll left"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="15 18 9 12 15 6"/>
                        </svg>
                    </button>
                    
                    <div className={styles.grid} ref={scrollContainerRef}>
                        {products.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                index={index}
                            />
                        ))}
                    </div>

                    <button 
                        className={`${styles.scrollButton} ${styles.scrollRight}`}
                        onClick={scrollRight}
                        aria-label="Scroll right"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="9 18 15 12 9 6"/>
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    )
}