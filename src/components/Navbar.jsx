'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { userCartStore } from "@/store/cartStore"
import toast from "react-hot-toast"
import styles from '../styles/navbar.module.css'

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
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

    useEffect(() => {
        if (isAuthenticated) {
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
                    <button className={styles.iconButton} aria-label="Search">
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

                                    <Link href='/dashboard' className={styles.dropdownItem} onClick={() => setShowUserMenu(false)}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                            <circle cx="12" cy="7" r="4"/>
                                        </svg>
                                        My Account
                                    </Link>
                                    <Link href='/orders' className={styles.dropdownItem} onClick={() => setShowUserMenu(false)}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                                            <line x1="3" y1="6" x2="21" y2="6"/>
                                            <path d="M16 10a4 4 0 0 1-8 0"/>
                                        </svg>
                                        My Orders
                                    </Link>

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
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle Menu"
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
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`${styles.mobileLink} ${
                            pathname === link.href ? styles.active : ''
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {link.label}
                    </Link>
                ))}
                
                {isAuthenticated ? (
                    <>
                        <Link
                            href='/dashboard'
                            className={styles.mobileLink}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            My Account
                        </Link>

                        <Link
                            href='/orders'
                            className={styles.mobileLink}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            My Orders
                        </Link>

                        <button
                            className={styles.mobileSignOut}
                            onClick={() => {
                                handleLogout()
                                setIsMobileMenuOpen(false)
                            }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link
                        href='/auth/signin'
                        className={styles.mobileSignIn}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Sign In
                    </Link>
                )}
            </div>

            {/* Overlay */}
            {(isMobileMenuOpen || showUserMenu) && (
                <div
                    className={styles.overlay}
                    onClick={() => {
                        setIsMobileMenuOpen(false)
                        setShowUserMenu(false)
                    }}
                ></div>
            )}
        </nav>
    )
}