'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from '../styles/hero.module.css'

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0)

    const slides = [
        {
            title: 'Welcome to Crown Mega Store',
            subtitle: 'Discover Amazing Products at Unbeatable Prices',
            cta: 'Shop Now',
            image: '/hero-1.png'
        },
        {
            title: 'New Arrivals',
            subtitle: 'Check Out Our Latest Collection',
            cta: 'Explore',
            image: '/hero-2.png'
        },
        {
            title: 'Special Offers',
            subtitle: 'Up to 50% Off on Selected Items',
            cta: 'View Deals',
            image: '/hero-3.png'
        }
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [slides.length])

    return (
        <section className={styles.hero}>
            <div className={styles.slideContainer}>
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`${styles.slide} ${
                            index === currentSlide ? styles.active : ''
                        }`}
                    >
                        <div className={styles.overlay}></div>
                        <div className={styles.content}>
                            <h1 className={styles.title}>{slide.title}</h1>
                            <p className={styles.subtitle}>{slide.subtitle}</p>
                            <Link href='/products' className={styles.cta}>
                                {slide.cta}
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                    <polyline points="12 5 19 12 12 19"/>
                                </svg>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Slide Indicators */}
            <div className={styles.indicators}>
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`${styles.indicator} ${
                            index === currentSlide ? styles.active : ''
                        }`}
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    ></button>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                className={`${styles.navButton} ${styles.prev}`}
                onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                aria-label='Previous slide'
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="15 18 9 12 15 6"/>
                </svg>
            </button>
            <button
                className={`${styles.navButton} ${styles.next}`}
                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                aria-label='Next slide'
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="9 18 15 12 9 6"/>
                </svg>
            </button>
        </section>
    )
}