import { Inter } from "next/font/google";
import Script from "next/script";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import AuthInitializer from "@/components/AuthInitializer";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://crownmegastore.vercel.app'),
  title: {
    default: "Crown Mega Store - Your One-Stop Shop",
    template: "%s - Crown Mega Store"
  },
  description: "Discover amazing products at unbeatable prices. Shop electronics, fashion, home goods and more with fast shipping and great customer service.",
  keywords: "online store, electronics, fashion, home goods, shopping, ecommerce",
  authors: [{ name: "Crown Mega Store" }],
  creator: "Crown Mega Store",
  publisher: "Crown Mega Store",
  
  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Crown Mega Store",
    title: {
      default: "Crown Mega Store - Your One-Stop Shop",
      template: "%s - Crown Mega Store"
    },
    description: "Discover amazing products at unbeatable prices. Shop electronics, fashion, home goods and more with fast shipping and great customer service.",
    images: [{
      url: "https://res.cloudinary.com/dusou66pz/image/upload/v1762425470/preview_ltrsbh.png",
      width: 1200,
      height: 630,
      alt: "Crown Mega Store - Your One-Stop Shop",
    }],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    site: "@f0rk-it",
    creator: "@f0rk-it",
    title: {
      default: "Crown Mega Store - Your One-Stop Shop",
      template: "%s - Crown Mega Store"
    },
    description: "Discover amazing products at unbeatable prices. Shop electronics, fashion, home goods and more with fast shipping and great customer service.",
  },

  // Additional metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Verification (add your actual verification codes)
  verification: {
    // google: 'your-google-site-verification',
    // yandex: 'your-yandex-verification',
    // yahoo: 'your-yahoo-site-verification',
  },

  // App-specific
  category: 'technology',
  classification: 'business',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Z69NKTEK43"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Z69NKTEK43');
          `}
        </Script>

        <AuthProvider>
          <AuthInitializer>
            <ConditionalNavbar />
            <main>{children}</main>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#faf9f5',
                  color: '#0a0905',
                  border: '2px solid #fdaf08'
                },
                success: {
                  iconTheme: {
                    primary: '#84c28d',
                    secondary: '#fff'
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff'
                  },
                },
              }}
            />
          </AuthInitializer>
        </AuthProvider>
      </body>
    </html>
  );
}
