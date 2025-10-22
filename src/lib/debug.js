// Debug helper for development
// Add this to browser console to clear all auth tokens and restart fresh

export const clearAllAuthTokens = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('authToken')
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        console.log('All auth tokens cleared. Please refresh the page.')
    }
}

// You can run this in the browser console:
// clearAllAuthTokens()
window.clearAllAuthTokens = clearAllAuthTokens