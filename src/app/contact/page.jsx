'use client'

import Link from 'next/link'
import styles from './contact.module.css'

export default function ContactPage() {
    const contactInfo = {
        phone: '+2348068402757',
        whatsapp: '+2348068402757',
        email: 'crownmegastore@gmail.com'
    }

    const handleWhatsAppClick = () => {
        window.open(`https://wa.me/${contactInfo.whatsapp.replace('+', '')}`, '_blank')
    }

    const handleEmailClick = () => {
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${contactInfo.email}`, '_blank')
    }

    const handlePhoneClick = () => {
        window.open(`tel:${contactInfo.phone}`, '_blank')
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Contact Us</h1>
                <p>Get in touch with Crown Mega Store. We're here to help!</p>
            </div>

            <div className={styles.contactContent}>
                <div className={styles.contactCards}>
                    {/* Phone Card */}
                    <div className={styles.contactCard}>
                        <div className={styles.cardIcon}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                            </svg>
                        </div>
                        <div className={styles.cardContent}>
                            <h3>Call Us</h3>
                            <p className={styles.contactValue}>{contactInfo.phone}</p>
                            <p className={styles.cardDescription}>
                                Call us during business hours for immediate assistance
                            </p>
                            <button 
                                className={`${styles.contactButton} ${styles.phoneButton}`}
                                onClick={handlePhoneClick}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                </svg>
                                Call Now
                            </button>
                        </div>
                    </div>

                    {/* WhatsApp Card */}
                    <div className={styles.contactCard}>
                        <div className={styles.cardIcon}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.451 3.188"/>
                            </svg>
                        </div>
                        <div className={styles.cardContent}>
                            <h3>WhatsApp</h3>
                            <p className={styles.contactValue}>{contactInfo.whatsapp}</p>
                            <p className={styles.cardDescription}>
                                Chat with us on WhatsApp for quick responses
                            </p>
                            <button 
                                className={`${styles.contactButton} ${styles.whatsappButton}`}
                                onClick={handleWhatsAppClick}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.451 3.188"/>
                                </svg>
                                Chat on WhatsApp
                            </button>
                        </div>
                    </div>

                    {/* Email Card */}
                    <div className={styles.contactCard}>
                        <div className={styles.cardIcon}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                <polyline points="22,6 12,13 2,6"/>
                            </svg>
                        </div>
                        <div className={styles.cardContent}>
                            <h3>Email Us</h3>
                            <p className={styles.contactValue}>{contactInfo.email}</p>
                            <p className={styles.cardDescription}>
                                Send us an email for detailed inquiries or support
                            </p>
                            <button 
                                className={`${styles.contactButton} ${styles.emailButton}`}
                                onClick={handleEmailClick}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                    <polyline points="22,6 12,13 2,6"/>
                                </svg>
                                Send Email
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.additionalInfo}>
                    <div className={styles.infoSection}>
                        <h2>Business Hours</h2>
                        <div className={styles.hoursGrid}>
                            <div className={styles.hoursItem}>
                                <span className={styles.day}>Monday - Friday</span>
                                <span className={styles.time}>9:00 AM - 7:00 PM</span>
                            </div>
                            <div className={styles.hoursItem}>
                                <span className={styles.day}>Saturday</span>
                                <span className={styles.time}>10:00 AM - 6:00 PM</span>
                            </div>
                            <div className={styles.hoursItem}>
                                <span className={styles.day}>Sunday</span>
                                <span className={styles.time}>12:00 PM - 5:00 PM</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.infoSection}>
                        <h2>Why Contact Us?</h2>
                        <div className={styles.reasonsList}>
                            <div className={styles.reason}>
                                <div className={styles.reasonIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 11l3 3L22 4"/>
                                        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                                    </svg>
                                </div>
                                <div className={styles.reasonContent}>
                                    <h4>Product Inquiries</h4>
                                    <p>Get detailed information about our products, availability, and specifications.</p>
                                </div>
                            </div>
                            <div className={styles.reason}>
                                <div className={styles.reasonIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <path d="M12 6v6l4 2"/>
                                    </svg>
                                </div>
                                <div className={styles.reasonContent}>
                                    <h4>Order Support</h4>
                                    <p>Track your orders, request changes, or get help with your purchases.</p>
                                </div>
                            </div>
                            <div className={styles.reason}>
                                <div className={styles.reasonIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                                    </svg>
                                </div>
                                <div className={styles.reasonContent}>
                                    <h4>Customer Service</h4>
                                    <p>Get assistance with returns, exchanges, or any other customer service needs.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.backToShop}>
                <Link href="/products" className="btn btn-primary">
                    Back to Shop
                </Link>
            </div>
        </div>
    )
}