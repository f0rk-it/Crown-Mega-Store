export async function generateMetadata({ params }) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://crown-mega-store.vercel.app'
    
    const res = await fetch(`${API_URL}/api/products/${params.id}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store'
    })
    
    if (!res.ok) {
        return {
            title: 'Product Not Found - Crown Mega Store',
            description: 'The requested product could not be found.'
        }
    }
    
    const product = await res.json()
    
    const title = `${product.name} - Crown Mega Store`
    const description = product.description || `Buy ${product.name} from Crown Mega Store at the best price`
    
    return {
        title,
        description,
        metadataBase: new URL(SITE_URL),
        openGraph: {
            title,
            description,
            type: 'website',
            siteName: 'Crown Mega Store',
            images: [
                {
                    url: product.image_url || 'https://via.placeholder.com/1200x630?text=Product+Image',
                    width: 1200,
                    height: 630,
                    alt: product.name,
                }
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [
                {
                    url: product.image_url || 'https://via.placeholder.com/1200x630?text=Product+Image',
                    width: 1200,
                    height: 630,
                    alt: product.name,
                }
            ],
        },
    }
}