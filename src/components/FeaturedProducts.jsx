'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import ProductCard from './ProductCard'
import styles from '../styles/featured.module.css'

export default function FeaturedProducts() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchFeaturedProducts()
    }, [])

    const fetchFeaturedProducts = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/products?limit=8&sort_by=balanced')
            const data = await response.json()
            setProducts(data.products || [])
        } catch (error) {
            console.error('Error fetching featured products:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <section className={styles.section}>
                <div className="container">
                    <div className={styles.loadingGrid}>
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className={styles.skeleton}></div>
                        ))}
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

                <div className={styles.grid}>
                    {products.map((product, index) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}