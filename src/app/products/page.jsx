'use client'

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import ProductCard from "@/components/ProductCard"
import { productsAPI } from "@/lib/api"
import styles from './products.module.css'

export default function ProductsPage() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        category: '',
        sortBy: 'balanced',
        search: ''
    })

    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        // Get initial filters from URL
        const category = searchParams.get('category') || ''
        const sortBy = searchParams.get('sortBy') || 'balanced'
        const search = searchParams.get('search') || ''

        setFilters({ category, sortBy, search })
    }, [searchParams])

    useEffect(() => {
        fetchProducts()
    }, [filters])

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const params = {
                limit: 50,
                sort_by: filters.sortBy
            }

            if (filters.category) {
                params.category = filters.category
            }

            let data
            if (filters.search) {
                data = await productsAPI.search(filters.search)
                setProducts(data.products || [])
            } else {
                data = await productsAPI.getAll(params)
                setProducts(data.products || [])
            }
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const data = await productsAPI.getCategories()
            setCategories(data.categories || [])
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    const updateFilters = (key, value) => {
        const newFilters = { ...filters, [key]: value }
        setFilters(newFilters)

        // Update URL
        const params = new URLSearchParams()
        if (newFilters.category) params.set('category', newFilters.category)
        if (newFilters.sortBy !== 'balanced') params.set('sort_by', newFilters.sortBy)
        if (newFilters.search) params.set('search', newFilters.search)

        router.push(`/products?${params.toString()}`)
    }

    const clearFilters = () => {
        setFilters({ category: '', sortBy: 'balanced', search: '' })
        router.push('/products')
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>All Products</h1>
                        <p className={styles.subtitle}>
                            {products.length} {products.length === 1 ? 'product': 'products'} available
                        </p>
                    </div>
                </div>

                <div className={styles.content}>
                    {/* Sidebar Filters */}
                    <aside className={styles.sidebar}>
                        <div className={styles.filterSection}>
                            <h3 className={styles.filterTitle}>Filters</h3>

                            {(filters.category || filters.search) && (
                                <button className={styles.clearFilters} onClick={clearFilters}>
                                    Clear All
                                </button>
                            )}
                        </div>

                        {/* Search */}
                        <div className={styles.filterSection}>
                            <label className={styles.filterLabel}>Search</label>
                            <input
                                type="text"
                                placeholder="Search Products..."
                                value={filters.search}
                                onChange={(e) => updateFilters('search', e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>

                        {/* Categories */}
                        <div className={styles.filterSection}>
                            <label className={styles.filterLabel}>Category</label>
                            <div className={styles.categoryList}>
                                <button
                                    className={`${styles.categoryItem} ${!filters.category ? styles.active : ''}`}
                                    onClick={() => updateFilters('category', '')}
                                >
                                    All Categories
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        className={`${styles.categoryItem} ${
                                            filters.category === category ? styles.active : ''
                                        }`}
                                        onClick={() => updateFilters('category', category)}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort By */}
                        <div className={styles.filterSection}>
                            <label className={styles.filterLabel}>Sort By</label>
                            <select
                                value={filters.sortBy}
                                onChange={(e) => updateFilters('sortBy', e.target.value)}
                                className={styles.select}
                            >
                                <option value="balanced">Recommended</option>
                                <option value="popularity">Most Popular</option>
                                <option value="price_low">Price: Low to High</option>
                                <option value="price_high">Price: High to Low</option>
                                <option value="newest">Newest Arrivals</option>
                                <option value="rating">Highest Rated</option>
                            </select>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <main className={styles.main}>
                        {loading ? (
                            <div className={styles.loadingGrid}>
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className={styles.skeleton}></div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className={styles.grid}>
                                {products.map((product, index) => (
                                    <ProductCard key={product.id} product={product} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className={styles.empty}>
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="11" cy="11" r="8"/>
                                    <path d="m21 21-4.35-4.35"/>
                                </svg>
                                <h3>No Products found</h3>
                                <p>Try adjusting your filters or search term</p>
                                <button className={styles.clearButton} onClick={clearFilters}>
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}