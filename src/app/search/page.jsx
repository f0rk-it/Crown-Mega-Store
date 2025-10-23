'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { productsAPI } from '@/lib/api'
import ProductCard from '@/components/ProductCard'
import styles from './search.module.css'

export default function SearchPage() {
    const [searchResults, setSearchResults] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const searchParams = useSearchParams()
    const query = searchParams.get('q') || ''

    useEffect(() => {
        if (query.trim()) {
            performSearch(query)
        }
    }, [query])

    const performSearch = async (searchTerm) => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await productsAPI.search(searchTerm)
            console.log('Search API response:', response) // Debug log
            
            // Handle API response structure (matches existing products page pattern)
            const results = response?.products || []
            
            setSearchResults(results)
        } catch (error) {
            console.error('Search error:', error)
            setError('Failed to search products. Please try again.')
            setSearchResults([])
        } finally {
            setIsLoading(false)
        }
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN'
        }).format(price)
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    Search Results
                    {query && <span className={styles.query}>for "{query}"</span>}
                </h1>
                {!isLoading && searchResults.length > 0 && (
                    <p className={styles.resultCount}>
                        {searchResults.length} {searchResults.length === 1 ? 'product' : 'products'} found
                    </p>
                )}
            </div>

            {isLoading ? (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Searching products...</p>
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
                    <h3>Oops! Something went wrong</h3>
                    <p>{error}</p>
                    <button 
                        className={styles.retryButton}
                        onClick={() => performSearch(query)}
                    >
                        Try Again
                    </button>
                </div>
            ) : searchResults.length === 0 && query ? (
                <div className={styles.noResults}>
                    <div className={styles.noResultsIcon}>
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </div>
                    <h2>No products found</h2>
                    <p>We couldn't find any products matching "{query}"</p>
                    <div className={styles.suggestions}>
                        <h3>Try these suggestions:</h3>
                        <ul>
                            <li>Check your spelling</li>
                            <li>Use more general terms</li>
                            <li>Try different keywords</li>
                            <li>Browse our categories instead</li>
                        </ul>
                    </div>
                </div>
            ) : !query ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </div>
                    <h2>Start searching</h2>
                    <p>Enter a search term to find products</p>
                </div>
            ) : (
                <div className={styles.results}>
                    <div className={styles.productsGrid}>
                        {Array.isArray(searchResults) && searchResults.length > 0 ? (
                            searchResults.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        ) : (
                            <div className={styles.noResults}>
                                <p>No products found</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}