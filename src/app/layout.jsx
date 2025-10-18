import { Inter } from "next/font/google";
import ConditionalNavbar from "@/components/ConditionalNavbar";
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
        <ConditionalNavbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
