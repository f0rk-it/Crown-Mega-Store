'use client'

import { useState, useEffect } from 'react'
import { productsAPI } from '@/lib/api'
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute'
import ImageUpload from '@/components/ImageUpload'
import OptimizedImage from '@/components/OptimizedImage'
import toast from 'react-hot-toast'
import Link from 'next/link'
import styles from './products.module.css'

export default function AdminProducts() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showProductModal, setShowProductModal] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('')
    const [searchTerm, setSearchTerm] = useState('')

    const [productForm, setProductForm] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image_url: '',
        stock_quantity: '',
        is_featured: false,
        is_new: false
    })

    useEffect(() => {
        fetchProducts()
        fetchCategories()
    }, [])

    useEffect(() => {
        if (selectedCategory || searchTerm) {
            filterProducts()
        } else {
            fetchProducts()
        }
    }, [selectedCategory, searchTerm])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await productsAPI.getAll({ limit: 100 })
            setProducts(response.products || response || [])
        } catch (error) {
            console.error('Failed to fetch products:', error)
            setError('Failed to load products')
        } finally {
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await productsAPI.getCategories()
            setCategories(response.categories || response || [])
        } catch (error) {
            console.error('Failed to fetch categories:', error)
        }
    }

    const filterProducts = async () => {
        try {
            setLoading(true)
            let response
            
            if (searchTerm) {
                response = await productsAPI.search(searchTerm)
            } else {
                response = await productsAPI.getAll({ 
                    category: selectedCategory,
                    limit: 100 
                })
            }
            
            setProducts(response.products || response || [])
        } catch (error) {
            console.error('Failed to filter products:', error)
            setError('Failed to filter products')
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setProductForm({
            name: '',
            description: '',
            price: '',
            category: '',
            image_url: '',
            stock_quantity: '',
            is_featured: false,
            is_new: false
        })
        setEditingProduct(null)
    }

    const handleAddProduct = () => {
        resetForm()
        setShowProductModal(true)
    }

    const handleEditProduct = (product) => {
        setProductForm({
            name: product.name || '',
            description: product.description || '',
            price: product.price || '',
            category: product.category || '',
            image_url: product.image_url || '',
            stock_quantity: product.stock_quantity || '',
            is_featured: product.is_featured || false,
            is_new: product.is_new || false
        })
        setEditingProduct(product)
        setShowProductModal(true)
    }

    const handleDeleteProduct = async (product) => {
        if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
            return
        }

        try {
            await productsAPI.delete(product.id)
            toast.success('Product deleted successfully')
            fetchProducts()
        } catch (error) {
            console.error('Failed to delete product:', error)
            toast.error('Failed to delete product')
        }
    }

    const validateProductData = (data) => {
        const errors = []
        
        if (!data.name?.trim()) {
            errors.push('Product name is required')
        }
        
        if (!data.price || isNaN(parseFloat(data.price)) || parseFloat(data.price) <= 0) {
            errors.push('Valid price is required')
        }
        
        if (!data.category?.trim()) {
            errors.push('Category is required')
        }
        
        if (data.stock_quantity && (isNaN(parseInt(data.stock_quantity)) || parseInt(data.stock_quantity) < 0)) {
            errors.push('Stock quantity must be a non-negative number')
        }
        
        return errors
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        
        // Validate the form data
        const validationErrors = validateProductData(productForm)
        if (validationErrors.length > 0) {
            toast.error(validationErrors[0])
            return
        }

        try {
            setSubmitting(true)
            
            // Prepare product data with proper types
            const productData = {
                name: productForm.name.trim(),
                description: productForm.description?.trim() || null,
                price: parseFloat(productForm.price).toFixed(2), // Send as string to avoid Decimal issues
                category: productForm.category,
                image_url: productForm.image_url?.trim() || null,
                stock_quantity: parseInt(productForm.stock_quantity) || 0,
                is_featured: Boolean(productForm.is_featured),
                is_new: Boolean(productForm.is_new)
            }

            if (editingProduct) {
                await productsAPI.update(editingProduct.id, productData)
                toast.success('Product updated successfully')
            } else {
                await productsAPI.create(productData)
                toast.success('Product created successfully')
            }

            setShowProductModal(false)
            resetForm()
            fetchProducts()
        } catch (error) {
            console.error('Failed to save product:', error)
            toast.error(`Failed to save product: ${error.message}`)
        } finally {
            setSubmitting(false)
        }
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN'
        }).format(price)
    }

    if (loading && products.length === 0) {
        return (
            <ProtectedAdminRoute>
                <div className={styles.container}>
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Loading products...</p>
                    </div>
                </div>
            </ProtectedAdminRoute>
        )
    }

    return (
        <ProtectedAdminRoute>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h1>Products Management</h1>
                        <p>Manage your product catalog</p>
                    </div>
                    <div className={styles.headerActions}>
                        <Link href="/admin/dashboard" className={styles.backButton}>
                            ← Back to Dashboard
                        </Link>
                        <button onClick={handleAddProduct} className={styles.addButton}>
                            + Add Product
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className={styles.filters}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className={styles.categoryFilter}
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    <button onClick={fetchProducts} className={styles.refreshButton}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="23 4 23 10 17 10"/>
                            <polyline points="1 20 1 14 7 14"/>
                            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                        </svg>
                        Refresh
                    </button>
                </div>

                {error ? (
                    <div className={styles.error}>
                        <p>{error}</p>
                        <button onClick={fetchProducts} className={styles.retryButton}>
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div className={styles.productsGrid}>
                        {products.length === 0 ? (
                            <div className={styles.emptyState}>
                                <h3>No products found</h3>
                                <p>Start by adding your first product to the catalog.</p>
                                <button onClick={handleAddProduct} className={styles.addButton}>
                                    Add Product
                                </button>
                            </div>
                        ) : (
                            products.map((product) => (
                                <div key={product.id} className={styles.productCard}>
                                    <div className={styles.productImage}>
                                        <OptimizedImage
                                            src={product.image_url}
                                            alt={product.name}
                                            size="admin"
                                            fallback="/placeholder-product.svg"
                                        />
                                        <div className={styles.productBadges}>
                                            {product.is_featured && (
                                                <span className={styles.badge + ' ' + styles.featured}>
                                                    Featured
                                                </span>
                                            )}
                                            {product.is_new && (
                                                <span className={styles.badge + ' ' + styles.new}>
                                                    New
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className={styles.productInfo}>
                                        <h3 className={styles.productName}>{product.name}</h3>
                                        <p className={styles.productCategory}>{product.category}</p>
                                        <p className={styles.productPrice}>{formatPrice(product.price)}</p>
                                        <p className={styles.productStock}>
                                            Stock: {product.stock_quantity} units
                                        </p>
                                        {product.description && (
                                            <p className={styles.productDescription}>
                                                {product.description.length > 100 
                                                    ? product.description.substring(0, 100) + '...'
                                                    : product.description
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div className={styles.productActions}>
                                        <button
                                            onClick={() => handleEditProduct(product)}
                                            className={styles.editButton}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                            </svg>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product)}
                                            className={styles.deleteButton}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <polyline points="3 6 5 6 21 6"/>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                                <line x1="10" y1="11" x2="10" y2="17"/>
                                                <line x1="14" y1="11" x2="14" y2="17"/>
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Product Modal */}
                {showProductModal && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                            
                            <form onSubmit={handleFormSubmit} className={styles.form}>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="name">Product Name *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={productForm.name}
                                            onChange={(e) => setProductForm(prev => ({
                                                ...prev, 
                                                name: e.target.value
                                            }))}
                                            required
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="category">Category *</label>
                                        <select
                                            id="category"
                                            value={productForm.category}
                                            onChange={(e) => setProductForm(prev => ({
                                                ...prev, 
                                                category: e.target.value
                                            }))}
                                            required
                                            className={styles.input}
                                        >
                                            <option value="">Select a category</option>
                                            <option value="Appliances">Appliances</option>
                                            <option value="Fashion">Fashion</option>
                                            <option value="Home & Office">Home & Office</option>
                                            <option value="Health & Beauty">Health & Beauty</option>
                                            <option value="Groceries">Groceries</option>
                                        </select>
                                    </div>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="price">Price *</label>
                                        <input
                                            type="number"
                                            id="price"
                                            step="0.01"
                                            min="0"
                                            value={productForm.price}
                                            onChange={(e) => setProductForm(prev => ({
                                                ...prev, 
                                                price: e.target.value
                                            }))}
                                            required
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="stock">Stock Quantity</label>
                                        <input
                                            type="number"
                                            id="stock"
                                            min="0"
                                            value={productForm.stock_quantity}
                                            onChange={(e) => setProductForm(prev => ({
                                                ...prev, 
                                                stock_quantity: e.target.value
                                            }))}
                                            className={styles.input}
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Product Image</label>
                                    <ImageUpload
                                        currentImage={productForm.image_url}
                                        onUploadSuccess={(result) => {
                                            setProductForm(prev => ({
                                                ...prev,
                                                image_url: result.url
                                            }))
                                        }}
                                        onUploadError={(error) => {
                                            toast.error(`Upload failed: ${error}`)
                                        }}
                                        disabled={submitting}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="description">Description</label>
                                    <textarea
                                        id="description"
                                        value={productForm.description}
                                        onChange={(e) => setProductForm(prev => ({
                                            ...prev, 
                                            description: e.target.value
                                        }))}
                                        className={styles.textarea}
                                        rows={4}
                                    />
                                </div>

                                <div className={styles.checkboxRow}>
                                    <label className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={productForm.is_featured}
                                            onChange={(e) => setProductForm(prev => ({
                                                ...prev, 
                                                is_featured: e.target.checked
                                            }))}
                                        />
                                        Featured Product
                                    </label>
                                    <label className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={productForm.is_new}
                                            onChange={(e) => setProductForm(prev => ({
                                                ...prev, 
                                                is_new: e.target.checked
                                            }))}
                                        />
                                        New Product
                                    </label>
                                </div>

                                <div className={styles.modalActions}>
                                    <button
                                        type="button"
                                        onClick={() => setShowProductModal(false)}
                                        className={styles.cancelButton}
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={styles.saveButton}
                                        disabled={submitting}
                                    >
                                        {submitting 
                                            ? 'Saving...' 
                                            : (editingProduct ? 'Update Product' : 'Create Product')
                                        }
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedAdminRoute>
    )
}