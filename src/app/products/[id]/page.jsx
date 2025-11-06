import ProductDetailPage from "./ProductClient"
import { productsAPI } from "@/lib/api"

export async function generateMetadata({ params }) {
    const product = await productsAPI.getById(params.id)

    if (!product) {
        return {
            title: 'Product Not Found',
            description: 'The requested product could not be found.'
        }
    }

    return {
        title: `${product.name} - Crown Mega Store`,
        description: `Buy ${product.name} from Crown Mega Store at the best price`,
        openGraph: {
            images: [{ url: product.image_url }]
        }
    }
}

export default function ProductPage() {
    return (
        <ProductDetailPage />
    )
}