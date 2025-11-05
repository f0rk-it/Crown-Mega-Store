import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Product Image'
export const size = {
    width: 1200,
    height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${params.id}`)
    const product = await res.json()
    
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'white',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '48px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '24px',
                    }}
                >
                    <img
                        src={product.image_url || 'https://via.placeholder.com/400'}
                        alt={product.name}
                        style={{
                            width: '300px',
                            height: '300px',
                            objectFit: 'cover',
                            borderRadius: '12px',
                            marginRight: '48px',
                        }}
                    />
                    <div style={{ flex: 1 }}>
                        <h1
                            style={{
                                fontSize: '48px',
                                fontWeight: 'bold',
                                color: '#1a1a1a',
                                marginBottom: '16px',
                            }}
                        >
                            {product.name}
                        </h1>
                        <p
                            style={{
                                fontSize: '24px',
                                color: '#666',
                                marginBottom: '24px',
                            }}
                        >
                            {product.description?.substring(0, 100)}
                            {product.description?.length > 100 ? '...' : ''}
                        </p>
                        <p
                            style={{
                                fontSize: '36px',
                                fontWeight: 'bold',
                                color: '#00875a',
                            }}
                        >
                            ₦{parseFloat(product.price).toLocaleString('en-NG')}
                        </p>
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f5f5f5',
                        padding: '16px 32px',
                        borderRadius: '8px',
                    }}
                >
                    <span
                        style={{
                            fontSize: '24px',
                            color: '#666',
                        }}
                    >
                        Available on Crown Mega Store
                    </span>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}