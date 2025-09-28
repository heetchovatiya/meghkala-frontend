// app/layout.tsx

import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer'; 
import { CartProvider } from '@/contexts/CartContext'; // <-- 1. IMPORT
import { AuthProvider } from '@/contexts/AuthContext'; // <-- IMPORT
import { ToastProvider } from '@/components/ui/ToastProvider'; // <-- IMPORT
import { StartupAnimationWrapper } from '@/components/common/StartupAnimationWrapper';
import 'react-datepicker/dist/react-datepicker.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'Meghkala',
  description: 'Discover unique, handcrafted pieces that transform spaces.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ToastProvider /> {/* Add the Toaster here */}
        <AuthProvider>
          <CartProvider> {/* <-- 2. WRAP WITH CARTPROVIDER */}
            <StartupAnimationWrapper>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow pt-20">{children}</main>
                <Footer />
              </div>
            </StartupAnimationWrapper>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}