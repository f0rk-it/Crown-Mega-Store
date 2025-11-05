export async function generateMetadata({ params }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${params.id}`)
    const product = await res.json()
    
    const title = `${product.name} - Crown Mega Store`
    const description = product.description || `Buy ${product.name} from Crown Mega Store at the best price`
    
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [`/products/${params.id}/opengraph-image`],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [`/products/${params.id}/twitter-image`],
        },
    }
}