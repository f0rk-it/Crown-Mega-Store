'use client'

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from '../styles/navbar.module.css'

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [cartCount, setCartCount] = useState(0)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // TODO: Get cart count from store
    useEffect(() => {
        // Simulate getting cart count from a store
        setCartCount(0)
    }, [])

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
                    <Link href='/cart' className={styles.iconButton}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 0 1-8 0"/>
                        </svg>
                        {cartCount > 0 && (
                            <span className={styles.badge}>{cartCount}</span>
                        )}
                    </Link>

                    {/* User/Auth */}
                    <Link href='/auth/signin' className={styles.iconButton}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                    </Link>

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
                <Link
                    href='/auth/signin'
                    className={styles.mobileSignIn}
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    Sign In
                </Link>
            </div>

            {/* Overlay */}
            {isMobileMenuOpen && (
                <div
                    className={styles.overlay}
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}
        </nav>
    )
}