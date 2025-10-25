import { Inter } from "next/font/google";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import AuthInitializer from "@/components/AuthInitializer";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Crown Mega Store - Your One-Stop Shop",
  description: "Discover amazing products at unbeatable prices",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
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
