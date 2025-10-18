import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import styles from './home.module.css'

export default function HomePage() {
  return (
    <div className={styles.homepage}>
      <Hero />

      <FeaturedProducts />

      {/* Categories Section */}
      <section className={styles.categoriesSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Shop by Category</h2>
          <div className={styles.categoriesGrid}>
            <CategoryCard name="Fashion" icon="👗" count={12} href='products/?category=Fashion' />
            <CategoryCard name="Appliances" icon="🔌" count={20} href='products/?category=Appliances' />
            <CategoryCard name="Groceries" icon="🥦" count={16} href='products/?category=Groceries' />
            <CategoryCard name="Home & Office" icon="🪑" count={22} href='products/?category=Home%20%26%20Office' />
            <CategoryCard name="Health & Beauty" icon="💅" count={14} href='products/?category=Health%20%26%20Beauty' />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className="container">
          <div className={styles.featuresGrid}>
            <FeatureCard
              icon={
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              }
              title='Customer Support'
              description='24/7 support to assist you'
            />
            <FeatureCard 
              icon={
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="1" y="3" width="15" height="13"/>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              }
              title="Fast Delivery"
              description="Quick and reliable shipping"
            />
            <FeatureCard 
              icon={
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              }
              title="Secure Payment"
              description="Your payment is safe"
            />
            <FeatureCard 
              icon={
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
              }
              title="Best Quality"
              description="Top-notch products"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function CategoryCard({ name, icon, count, href }) {
  return (
    <a href={href} className={styles.categoryCard}>
      <span className={styles.categoryIcon}>{icon}</span>
      <h3 className={styles.categoryName}>{name}</h3>
      <p className={styles.categoryCount}>{count} Products</p>
    </a>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className={styles.featureCard}>
      <div className={styles.featureIcon}>{icon}</div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDescription}>{description}</p>
    </div>
  )
}
