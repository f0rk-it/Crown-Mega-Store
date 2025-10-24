// Cloudinary configuration
export const cloudinaryConfig = {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    uploadPreset: 'crown_mega_store' // We'll create this in Cloudinary dashboard
}

// Upload function for images
export const uploadToCloudinary = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', cloudinaryConfig.uploadPreset)
    formData.append('folder', 'crown_mega_store/products')

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData
            }
        )

        if (!response.ok) {
            throw new Error('Upload failed')
        }

        const data = await response.json()
        return {
            url: data.secure_url,
            publicId: data.public_id,
            width: data.width,
            height: data.height
        }
    } catch (error) {
        console.error('Cloudinary upload error:', error)
        throw error
    }
}

// Generate optimized image URLs
export const getOptimizedImageUrl = (publicId, transformations = {}) => {
    const { width = 'auto', height = 'auto', quality = 'auto', format = 'auto' } = transformations
    
    const baseUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload`
    const transforms = `w_${width},h_${height},c_fill,f_${format},q_${quality}`
    
    return `${baseUrl}/${transforms}/${publicId}`
}

// Predefined image sizes for different use cases
export const imageSizes = {
    thumbnail: { width: 150, height: 150 },
    card: { width: 300, height: 300 },
    detail: { width: 800, height: 600 },
    admin: { width: 100, height: 100 }
}