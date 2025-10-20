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
            set({
                items: data.items || [],
                total: data.total || 0,
                itemCount: data.item_count || 0,
                loading: false
            })
        } catch (error) {
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
            return false
        }
    },

    // Update item quantity
    updateItem: async (productId, quantity) => {
        try {
            await cartAPI.update(productId, quantity)
            await get().fetchCart()
            return true
        } catch (error) {
            console.error('Update cart item error:', error)
            return false
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