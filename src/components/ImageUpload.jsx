'use client'

import { useState, useRef } from 'react'
import { uploadToCloudinary } from '@/lib/cloudinary'
import styles from './ImageUpload.module.css'

export default function ImageUpload({ 
    onUploadSuccess, 
    onUploadError, 
    currentImage = null,
    disabled = false,
    className = ''
}) {
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState(currentImage)
    const [dragOver, setDragOver] = useState(false)
    const fileInputRef = useRef(null)

    const validateFile = (file) => {
        // Check file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            throw new Error('Please upload a valid image file (JPEG, PNG, or WebP)')
        }

        // Check file size (5MB limit)
        const maxSize = 5 * 1024 * 1024 // 5MB in bytes
        if (file.size > maxSize) {
            throw new Error('File size must be less than 5MB')
        }

        return true
    }

    const handleFileUpload = async (file) => {
        try {
            validateFile(file)
            setUploading(true)

            // Create preview
            const previewUrl = URL.createObjectURL(file)
            setPreview(previewUrl)

            // Upload to Cloudinary
            const result = await uploadToCloudinary(file)
            
            // Clean up preview URL
            URL.revokeObjectURL(previewUrl)
            
            // Update preview with actual Cloudinary URL
            setPreview(result.url)
            
            // Notify parent component
            onUploadSuccess?.(result)
            
        } catch (error) {
            console.error('Upload error:', error)
            setPreview(currentImage) // Reset to original image
            onUploadError?.(error.message)
        } finally {
            setUploading(false)
        }
    }

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            handleFileUpload(file)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragOver(false)
        
        const file = e.dataTransfer.files?.[0]
        if (file) {
            handleFileUpload(file)
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setDragOver(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setDragOver(false)
    }

    const openFileDialog = () => {
        fileInputRef.current?.click()
    }

    const removeImage = () => {
        setPreview(null)
        onUploadSuccess?.({ url: null, publicId: null })
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div className={`${styles.container} ${className}`}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                disabled={disabled || uploading}
            />

            {preview ? (
                <div className={styles.preview}>
                    <img 
                        src={preview} 
                        alt="Preview" 
                        className={styles.previewImage}
                    />
                    <div className={styles.previewOverlay}>
                        {!disabled && !uploading && (
                            <>
                                <button
                                    type="button"
                                    onClick={openFileDialog}
                                    className={styles.changeButton}
                                >
                                    Change Image
                                </button>
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className={styles.removeButton}
                                >
                                    Remove
                                </button>
                            </>
                        )}
                    </div>
                    {uploading && (
                        <div className={styles.uploadingOverlay}>
                            <div className={styles.spinner}></div>
                            <span>Uploading...</span>
                        </div>
                    )}
                </div>
            ) : (
                <div
                    className={`${styles.dropzone} ${dragOver ? styles.dragOver : ''} ${disabled ? styles.disabled : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={disabled || uploading ? undefined : openFileDialog}
                >
                    {uploading ? (
                        <div className={styles.uploading}>
                            <div className={styles.spinner}></div>
                            <span>Uploading image...</span>
                        </div>
                    ) : (
                        <div className={styles.dropzoneContent}>
                            <svg 
                                className={styles.uploadIcon} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                                />
                            </svg>
                            <p className={styles.dropzoneText}>
                                <span className={styles.highlight}>Click to upload</span> or drag and drop
                            </p>
                            <p className={styles.dropzoneSubtext}>
                                PNG, JPG, WebP up to 5MB
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}