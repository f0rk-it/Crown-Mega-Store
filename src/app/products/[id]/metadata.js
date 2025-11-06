export async function generateMetadata({ params }) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    
    const res = await fetch(`${API_URL}/api/products/${params.id}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        next: { revalidate: 60 } // Cache for 60 seconds
    })
    
    if (!res.ok) {
        return {
            title: 'Product Not Found',
            description: 'The requested product could not be found.'
        }
    }
    
    const product = await res.json()
    
    const title = product.name
    const description = product.description || `Buy ${product.name} from Crown Mega Store at the best price`

    const productImage = product.image_url || 'https://via.placeholder.com/1200x630?text=Product+Image'
    
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'product',
            images: [{
                url: productImage,
                width: 1200,
                height: 630,
                alt: product.name,
            }],
            url: `/products/${params.id}`,
            
            // Product specific metadata
            availability: product.stock_quantity > 0 ? 'instock' : 'outofstock',
            price: {
                amount: product.price,
                currency: 'NGN',
            },
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [{
                url: productImage,
                width: 1200,
                height: 630,
                alt: product.name,
            }],
        },
        
        // Add structured data for rich results
        alternates: {
            canonical: `/products/${params.id}`,
        }
    }
}