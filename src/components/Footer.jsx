'use client'

import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
    const handleWhatsAppClick = () => {
        window.open('https://wa.me/2349132135506', '_blank')
    }

    const handleGithubClick = () => {
        window.open('https://github.com/f0rk-it', '_blank')
    }

    const handleXClick = () => {
        window.open('https://x.com/f0rk_it', '_blank')
    }

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Main Footer Content */}
                <div className={styles.footerContent}>
                    {/* Brand Section */}
                    <div className={styles.brandSection}>
                        <div className={styles.logo}>
                            <h3>Crown Mega Store</h3>
                        </div>
                        <p className={styles.brandDescription}>
                            Your trusted partner for quality products at affordable prices. 
                            We bring you the best shopping experience with fast delivery and excellent customer service.
                        </p>
                        <div className={styles.socialLinks}>
                            <button 
                                className={`${styles.socialLink} ${styles.github}`}
                                onClick={handleGithubClick}
                                title="Visit our GitHub"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                                </svg>
                            </button>
                            <button 
                                className={`${styles.socialLink} ${styles.twitter}`}
                                onClick={handleXClick}
                                title="Follow us on X"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </button>
                            <button 
                                className={`${styles.socialLink} ${styles.whatsapp}`}
                                onClick={handleWhatsAppClick}
                                title="Chat with me on WhatsApp"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.451 3.188"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className={styles.linksSection}>
                        <h4>Quick Links</h4>
                        <div className={styles.linksList}>
                            <Link href="/" className={styles.footerLink}>Home</Link>
                            <Link href="/products" className={styles.footerLink}>Products</Link>
                            <Link href="/contact" className={styles.footerLink}>Contact Us</Link>
                            <Link href="/cart" className={styles.footerLink}>Cart</Link>
                        </div>
                    </div>

                    {/* Customer Service */}
                    <div className={styles.linksSection}>
                        <h4>Customer Service</h4>
                        <div className={styles.linksList}>
                            <Link href="/account/orders" className={styles.footerLink}>Track Orders</Link>
                            <Link href="/contact" className={styles.footerLink}>Support</Link>
                            <a href="tel:+2348068402757" className={styles.footerLink}>Call Us</a>
                            <a href='https://mail.google.com/mail/?view=cm&fs=1&to=crownmegastore@gmail.com' target='_blank' className={styles.footerLink}>Email Us</a>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className={styles.contactSection}>
                        <h4>Get In Touch</h4>
                        <div className={styles.contactInfo}>
                            <div className={styles.contactItem}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                </svg>
                                <span>+234 806 840 2757</span>
                            </div>
                            <div className={styles.contactItem}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                    <polyline points="22,6 12,13 2,6"/>
                                </svg>
                                <span>crownmegastore@gmail.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className={styles.bottomBar}>
                    <div className={styles.copyright}>
                        <p>&copy; {new Date().getFullYear()} Crown Mega Store. All rights reserved.</p>
                    </div>
                    <div className={styles.developer}>
                        <p>
                            Built with ❤️ by{' '}
                            <button 
                                className={styles.developerLink}
                                onClick={handleGithubClick}
                            >
                                f0rk-it
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
