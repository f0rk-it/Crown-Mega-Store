import { create } from "zustand"
import { cartAPI } from "@/lib/api"

export const userCartStore = create((set, get) => ({
    items: [],
    total: 0,
    itemCount: 0,
    loading: false,

    // Fetch cart from backend
    fetchCart: async () => {
        set({ loading: true })
        try {
            const data = await cartAPI.get()
            console.log('Cart API response:', data) // Debug log
            
            set({
                items: data.items || [],
                total: data.total || 0,
                itemCount: data.item_count || 0,
                loading: false
            })
        } catch (error) {
            console.error('fetchCart error:', error) // Debug log
            
            // Silently fail if not authenticated
            if (error.message?.includes('Not authenticated') || error.message?.includes('401')) {
                set({
                    items: [],
                    total: 0,
                    itemCount: 0,
                    loading: false
                })
            } else {
                console.error('Failed to fetch cart:', error)
                set({ loading: false })
            }
        }
    },

    // Add item cart
    addItem: async (productId, quantity = 1) => {
        try {
            await cartAPI.add(productId, quantity)
            await get().fetchCart()
            return true
        } catch (error) {
            console.error('Add to cart error:', error)
            
            // Throw a more descriptive error for the UI to handle
            if (error.message?.includes('Not authenticated') || error.message?.includes('401')) {
                throw new Error('Please sign in to add items to your cart')
            }
            
            throw new Error('Failed to add item to cart. Please try again.')
        }
    },

    // Update item quantity
    updateItem: async (productId, quantity) => {
        try {
            console.log('Store: Updating item:', { productId, quantity }) // Debug log
            
            if (quantity <= 0) {
                // If quantity is 0 or less, just remove the item
                await cartAPI.remove(productId)
            } else {
                // For quantity > 0, we need to implement a different approach
                // Since there's no update endpoint, we'll modify the local state
                // and let the backend handle it through remove + add
                
                const currentItems = get().items
                const existingItem = currentItems.find(item => item.product_id === productId)
                
                if (existingItem) {
                    // Calculate the difference
                    const currentQty = existingItem.quantity
                    const difference = quantity - currentQty
                    
                    if (difference > 0) {
                        // Need to add more
                        await cartAPI.add(productId, difference)
                    } else if (difference < 0) {
                        // Need to remove some - remove the item and re-add with correct quantity
                        await cartAPI.remove(productId)
                        if (quantity > 0) {
                            await cartAPI.add(productId, quantity)
                        }
                    }
                    // If difference is 0, no change needed
                }
            }
            
            await get().fetchCart()
            return true
        } catch (error) {
            console.error('Update cart item error:', error)
            
            // Throw a more descriptive error for the UI to handle
            if (error.message?.includes('Not authenticated') || error.message?.includes('401')) {
                throw new Error('Please sign in to update your cart')
            }
            
            throw new Error('Failed to update cart item. Please try again.')
        }
    },

    // Remove item from cart
    removeItem: async (productId) => {
        try {
            await cartAPI.remove(productId)
            await get().fetchCart()
            return true
        } catch (error) {
            console.error('Remove cart item error:', error)
            return false
        }
    },

    // Clear entire cart
    clearCart: async () => {
        try {
            await cartAPI.clear()
            set({
                items: [],
                total: 0,
                itemCount: 0
            })
            return true
        } catch (error) {
            console.error('Clear cart error:', error)
            return false
        }
    },

    // Get cart count (for navbar badge)
    getCartCount: async () => {
        try {
            const data = await cartAPI.getCount()
            set({ itemCount: data.count })
        } catch (error) {
            // Silently fail if not authenticated
            if (error.message?.includes('Not authenticated') || error.message?.includes('401')) {
                set({ itemCount: 0 })
            } else {
                console.error('Failed to get cart count:', error)
            }
        }
    },
}))