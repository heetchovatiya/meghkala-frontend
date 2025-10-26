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
import { PerformanceOptimizer } from '@/components/seo/PerformanceOptimizer';
import 'react-datepicker/dist/react-datepicker.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Meghkala - Handcrafted Art & Home Decor | Premium Indian Handicrafts',
    template: '%s | Meghkala'
  },
  description: 'Discover exquisite handcrafted art pieces, home decor, and traditional Indian handicrafts at Meghkala. Premium quality, authentic craftsmanship, and unique designs for your home.',
  keywords: [
    'handcrafted art',
    'Indian handicrafts',
    'home decor',
    'traditional art',
    'premium handicrafts',
    'art pieces',
    'decorative items',
    'handmade products',
    'Indian art',
    'cultural artifacts'
  ],
  authors: [{ name: 'Meghkala' }],
  creator: 'Meghkala',
  publisher: 'Meghkala',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://meghkala.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://meghkala.com',
    siteName: 'Meghkala',
    title: 'Meghkala - Handcrafted Art & Home Decor | Premium Indian Handicrafts',
    description: 'Discover exquisite handcrafted art pieces, home decor, and traditional Indian handicrafts at Meghkala. Premium quality, authentic craftsmanship, and unique designs for your home.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Meghkala - Handcrafted Art & Home Decor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meghkala - Handcrafted Art & Home Decor | Premium Indian Handicrafts',
    description: 'Discover exquisite handcrafted art pieces, home decor, and traditional Indian handicrafts at Meghkala. Premium quality, authentic craftsmanship, and unique designs for your home.',
    images: ['/og-image.jpg'],
    creator: '@meghkala',
  },
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ToastProvider /> {/* Add the Toaster here */}
        <AuthProvider>
          <CartProvider> {/* <-- 2. WRAP WITH CARTPROVIDER */}
            <PerformanceOptimizer />
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