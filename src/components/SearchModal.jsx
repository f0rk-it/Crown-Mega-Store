'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { productsAPI } from '@/lib/api'
import styles from '../styles/searchModal.module.css'

export default function SearchModal({ isOpen, onClose }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const router = useRouter()
    const inputRef = useRef(null)
    const suggestionRefs = useRef([])

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current.focus()
            }, 100)
        }
    }, [isOpen])

    // Close modal on escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                handleClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [isOpen])

    // Debounced search for suggestions
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm.trim() && searchTerm.length >= 2) {
                fetchSuggestions(searchTerm)
            } else {
                setSuggestions([])
                setShowSuggestions(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [searchTerm])

    const fetchSuggestions = async (term) => {
        try {
            setIsLoading(true)
            const response = await productsAPI.search(term)
            console.log('Search suggestions API response:', response) // Debug log
            
            // Handle API response structure (matches existing products page pattern)
            const results = response?.products || []
            
            // Limit to 6 suggestions for better UX
            const limitedResults = results.slice(0, 6)
            setSuggestions(limitedResults)
            setShowSuggestions(limitedResults.length > 0)
            setSelectedIndex(-1)
        } catch (error) {
            console.error('Search suggestions error:', error)
            setSuggestions([])
            setShowSuggestions(false)
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setSearchTerm('')
        setSuggestions([])
        setShowSuggestions(false)
        setSelectedIndex(-1)
        onClose()
    }

    const handleSearch = (term = searchTerm) => {
        if (term.trim()) {
            router.push(`/search?q=${encodeURIComponent(term.trim())}`)
            handleClose()
        }
    }

    const handleSuggestionClick = (suggestion) => {
        router.push(`/products/${suggestion.id}`)
        handleClose()
    }

    const handleKeyDown = (e) => {
        if (!showSuggestions) {
            if (e.key === 'Enter') {
                handleSearch()
            }
            return
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setSelectedIndex(prev => 
                    prev < suggestions.length - 1 ? prev + 1 : prev
                )
                break
            case 'ArrowUp':
                e.preventDefault()
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
                break
            case 'Enter':
                e.preventDefault()
                if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                    handleSuggestionClick(suggestions[selectedIndex])
                } else {
                    handleSearch()
                }
                break
        }
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN'
        }).format(price)
    }

    if (!isOpen) return null

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.searchHeader}>
                    <div className={styles.searchInputContainer}>
                        <div className={styles.searchIcon}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                        </div>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search for products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className={styles.searchInput}
                        />
                        {isLoading && (
                            <div className={styles.loadingSpinner}>
                                <div className={styles.spinner}></div>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleClose}
                        className={styles.closeButton}
                        aria-label="Close search"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {showSuggestions && (
                    <div className={styles.suggestions}>
                        <div className={styles.suggestionsHeader}>
                            <h3>Products</h3>
                        </div>
                        <div className={styles.suggestionsList}>
                            {Array.isArray(suggestions) && suggestions.length > 0 ? (
                                suggestions.map((suggestion, index) => (
                                    <div
                                        key={suggestion.id || index}
                                        ref={(el) => suggestionRefs.current[index] = el}
                                        className={`${styles.suggestion} ${
                                            index === selectedIndex ? styles.selected : ''
                                        }`}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        <div className={styles.suggestionImage}>
                                            <img
                                                src={suggestion.image_url || '/placeholder-product.svg'}
                                                alt={suggestion.name || 'Product'}
                                                onError={(e) => {
                                                    e.target.src = '/placeholder-product.svg'
                                                }}
                                            />
                                        </div>
                                        <div className={styles.suggestionContent}>
                                            <h4 className={styles.suggestionName}>
                                                {suggestion.name || 'Unknown Product'}
                                            </h4>
                                            <p className={styles.suggestionPrice}>
                                                {formatPrice(suggestion.price || 0)}
                                            </p>
                                            {suggestion.category && (
                                                <span className={styles.suggestionCategory}>
                                                    {suggestion.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className={styles.noSuggestions}>
                                    <p>No suggestions available</p>
                                </div>
                            )}
                        </div>
                        {searchTerm.trim() && (
                            <div className={styles.searchAllContainer}>
                                <button
                                    className={styles.searchAllButton}
                                    onClick={() => handleSearch()}
                                >
                                    Search all results for "{searchTerm}"
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <line x1="7" y1="17" x2="17" y2="7"></line>
                                        <polyline points="7,7 17,7 17,17"></polyline>
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {searchTerm.trim() && !isLoading && suggestions.length === 0 && (
                    <div className={styles.noResults}>
                        <div className={styles.noResultsIcon}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                        </div>
                        <h3>No products found</h3>
                        <p>Try searching for something else</p>
                    </div>
                )}
            </div>
        </div>
    )
}