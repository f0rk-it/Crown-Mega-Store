'use client'

import { useState } from 'react'
import { getOptimizedImageUrl, imageSizes } from '@/lib/cloudinary'
import styles from './OptimizedImage.module.css'

export default function OptimizedImage({
    src,
    alt = '',
    size = 'card', // thumbnail, card, detail, admin, or custom
    customSize = null, // { width, height } for custom dimensions
    className = '',
    fallback = '/images/placeholder-product.png', // Default placeholder
    priority = false,
    ...props
}) {
    const [imageError, setImageError] = useState(false)
    const [loading, setLoading] = useState(true)

    // If no src provided or error occurred, show fallback
    if (!src || imageError) {
        return (
            <img
                src={fallback}
                alt={alt}
                className={`${styles.image} ${className}`}
                onLoad={() => setLoading(false)}
                {...props}
            />
        )
    }

    // Check if it's a Cloudinary URL (contains cloudinary.com)
    const isCloudinaryUrl = src.includes('cloudinary.com')
    
    let optimizedSrc = src
    
    if (isCloudinaryUrl) {
        // Extract public_id from Cloudinary URL
        const urlParts = src.split('/')
        const uploadIndex = urlParts.findIndex(part => part === 'upload')
        
        if (uploadIndex !== -1 && uploadIndex < urlParts.length - 1) {
            // Get everything after 'upload/' as the public_id (including folder path)
            const publicId = urlParts.slice(uploadIndex + 1).join('/')
            
            // Get size configuration
            const sizeConfig = customSize || imageSizes[size] || imageSizes.card
            
            // Generate optimized URL
            optimizedSrc = getOptimizedImageUrl(publicId, {
                width: sizeConfig.width,
                height: sizeConfig.height,
                quality: 'auto',
                format: 'auto'
            })
        }
    }

    return (
        <div className={`${styles.container} ${loading ? styles.loading : ''} ${className}`}>
            {loading && (
                <div className={styles.loadingPlaceholder}>
                    <div className={styles.loadingSpinner}></div>
                </div>
            )}
            <img
                src={optimizedSrc}
                alt={alt}
                className={styles.image}
                onLoad={() => setLoading(false)}
                onError={() => {
                    setImageError(true)
                    setLoading(false)
                }}
                loading={priority ? 'eager' : 'lazy'}
                {...props}
            />
        </div>
    )
}