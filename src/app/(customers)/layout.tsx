import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import CartProvider from "@/app/components/cart/CartProvider";
import { RoleSyncProvider } from "@/components/role-sync-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CoffeeShop - Premium Coffee Experience",
  description:
    "Discover our premium coffee selection and exceptional brewing experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RoleSyncProvider>
          <CartProvider>
            <Header />
            <main className="">{children}</main>
          </CartProvider>
        </RoleSyncProvider>
      </body>
    </html>
  );
}
