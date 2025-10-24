'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { userCartStore } from "@/store/cartStore"
import SearchModal from "./SearchModal"
import toast from "react-hot-toast"
import styles from '../styles/navbar.module.css'

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showSearchModal, setShowSearchModal] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    const { user, isAuthenticated, logout } = useAuthStore()
    const { itemCount, getCartCount } = userCartStore()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
            document.body.style.position = 'fixed'
            document.body.style.top = `-${window.scrollY}px`
            document.body.style.width = '100%'
        } else {
            const scrollY = document.body.style.top
            document.body.style.overflow = ''
            document.body.style.position = ''
            document.body.style.top = ''
            document.body.style.width = ''
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1)
            }
        }

        return () => {
            // Cleanup on unmount
            document.body.style.overflow = ''
            document.body.style.position = ''
            document.body.style.top = ''
            document.body.style.width = ''
        }
    }, [isMobileMenuOpen])

    // Keyboard shortcut for search
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault()
                handleSearchClick()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [])

    useEffect(() => {
        // Only get cart count if user is authenticated and loading is complete
        if (isAuthenticated && !useAuthStore.getState().loading) {
            getCartCount()
        }
    }, [isAuthenticated, getCartCount])

    const handleLogout = async () => {
        try {
            await logout()
            setShowUserMenu(false)
            toast.success('Logged out successfully')
            router.push('/')
        } catch (error) {
            toast.error('Failed to logout')
        }
    }

    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
        // Close user menu if open
        if (showUserMenu) {
            setShowUserMenu(false)
        }
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    const closeUserMenu = () => {
        setShowUserMenu(false)
    }

    const handleOverlayClick = () => {
        setIsMobileMenuOpen(false)
        setShowUserMenu(false)
    }

    const handleSearchClick = () => {
        setShowSearchModal(true)
        // Close other menus
        setIsMobileMenuOpen(false)
        setShowUserMenu(false)
    }

    const handleCloseSearch = () => {
        setShowSearchModal(false)
    }

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/products', label: 'Products' },
        { href: '/categories', label: 'Categories' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
    ]

    return (
        <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled: ''}`}>
            <div className={styles.container}>
                {/* Logo */}
                <Link href='/' className={styles.logo}>
                    <img src="/logo.png" alt="Crown Mega Store Logo" />
                </Link>

                {/* Desktop Navigation */}
                <div className={styles.navLinks}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`${styles.navLink} ${
                                pathname === link.href ? styles.active : ''
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Right Actions */}
                <div className={styles.actions}>
                    {/* Search Icon */}
                    <button 
                        className={`${styles.iconButton} ${styles.searchButton}`}
                        aria-label="Search products (Ctrl+K)"
                        title="Search products (Ctrl+K)"
                        onClick={handleSearchClick}
                    >
                        <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
                            <circle cx='11' cy='11' r='8' />
                            <path d='m21 21-4.35-4.35' />
                        </svg>
                    </button>

                    {/* Cart Icon with Badge */}
                    {isAuthenticated ? (
                        <Link href='/cart' className={styles.iconButton}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                                <line x1="3" y1="6" x2="21" y2="6"/>
                                <path d="M16 10a4 4 0 0 1-8 0"/>
                            </svg>
                            {itemCount > 0 && (
                                <span className={styles.badge}>{itemCount}</span>
                            )}
                        </Link>
                    ) : (
                        <button
                            className={styles.iconButton}
                            onClick={() => router.push('/auth/signin?redirect=/cart')}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                                <line x1="3" y1="6" x2="21" y2="6"/>
                                <path d="M16 10a4 4 0 0 1-8 0"/>
                            </svg>
                        </button>
                    )}

                    {/* User Menu */}
                    {isAuthenticated ? (
                        <div className={styles.userMenu}>
                            <button
                                className={styles.userButton}
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                {user?.avatar_url ? (
                                    <img src={user.avatar_url} alt={user.name} className={styles.avatar} />
                                ) : (
                                    <div className={styles.avatarPlaceholder}>
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                )}
                            </button>

                            {showUserMenu && (
                                <div className={styles.userDropdown}>
                                    <div className={styles.userInfo}>
                                        <p className={styles.userName}>{user?.name}</p>
                                        <p className={styles.userEmail}>{user?.email}</p>
                                    </div>

                                    <div className={styles.dropdownDivider}></div>

                                    <Link href='/account/dashboard' className={styles.dropdownItem} onClick={() => setShowUserMenu(false)}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                            <circle cx="12" cy="7" r="4"/>
                                        </svg>
                                        My Account
                                    </Link>
                                    <Link href='/account/orders' className={styles.dropdownItem} onClick={() => setShowUserMenu(false)}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                                            <line x1="3" y1="6" x2="21" y2="6"/>
                                            <path d="M16 10a4 4 0 0 1-8 0"/>
                                        </svg>
                                        My Orders
                                    </Link>

                                    {/* Admin Link - Only show for admin users */}
                                    {user?.role === 'admin' && (
                                        <Link href='/admin/dashboard' className={styles.dropdownItem} onClick={() => setShowUserMenu(false)}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                                            </svg>
                                            Admin Dashboard
                                        </Link>
                                    )}

                                    <div className={styles.dropdownDivider}></div>

                                    <button className={styles.dropdownItem} onClick={handleLogout}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                            <polyline points="16 17 21 12 16 7"/>
                                            <line x1="21" y1="12" x2="9" y2="12"/>
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href='/auth/signin' className={styles.signInButton}>
                            Sign In
                        </Link>
                    )}
                    

                    {/* Mobile Menu Toggle */}
                    <button
                        className={styles.menuToggle}
                        onClick={handleMobileMenuToggle}
                        aria-label="Toggle Menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.open : ''}`}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
                {/* Search Link for Mobile */}
                <button
                    className={styles.mobileSearchButton}
                    onClick={() => {
                        handleSearchClick()
                        closeMobileMenu()
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    Search Products
                </button>

                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`${styles.mobileLink} ${
                            pathname === link.href ? styles.active : ''
                        }`}
                        onClick={closeMobileMenu}
                    >
                        {link.label}
                    </Link>
                ))}
                
                {isAuthenticated ? (
                    <>
                        <Link
                            href='/account/dashboard'
                            className={styles.mobileLink}
                            onClick={closeMobileMenu}
                        >
                            My Account
                        </Link>

                        <Link
                            href='/account/orders'
                            className={styles.mobileLink}
                            onClick={closeMobileMenu}
                        >
                            My Orders
                        </Link>

                        {/* Admin Link for Mobile - Only show for admin users */}
                        {user?.role === 'admin' && (
                            <Link
                                href='/admin/dashboard'
                                className={styles.mobileLink}
                                onClick={closeMobileMenu}
                            >
                                Admin Dashboard
                            </Link>
                        )}

                        <button
                            className={styles.mobileSignOut}
                            onClick={() => {
                                handleLogout()
                                closeMobileMenu()
                            }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link
                        href='/auth/signin'
                        className={styles.mobileSignIn}
                        onClick={closeMobileMenu}
                    >
                        Sign In
                    </Link>
                )}
            </div>

            {/* Overlay */}
            {(isMobileMenuOpen || showUserMenu) && (
                <div
                    className={styles.overlay}
                    onClick={handleOverlayClick}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                            handleOverlayClick()
                        }
                    }}
                ></div>
            )}

            {/* Search Modal */}
            <SearchModal isOpen={showSearchModal} onClose={handleCloseSearch} />
        </nav>
    )
}