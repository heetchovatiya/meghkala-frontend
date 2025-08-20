// components/layout/Footer.tsx

import Link from 'next/link';
import { Logo } from '@/components/common/Logo';
import { Instagram, Facebook, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary-bg text-text-color">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Column 1: Brand and Socials */}
          <div className="flex flex-col items-center md:items-start">
            <Logo />
            <p className="mt-4 max-w-xs">
              Handcrafted artistry for the modern home.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://www.instagram.com/meghkala.in/" target="_blank" rel="noopener noreferrer" className="hover:text-heading-color transition-colors">
                <Instagram size={24} />
              </a>
              {/* <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-heading-color transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-heading-color transition-colors">
                <Twitter size={24} />
              </a> */}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-heading-color mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><Link href="/products" className="hover:text-heading-color transition-colors">All Collections</Link></li>
              <li><Link href="/categories" className="hover:text-heading-color transition-colors">Categories</Link></li>
              <li><Link href="/our-story" className="hover:text-heading-color transition-colors">Our Story</Link></li>
             {/*<li><Link href="/contact" className="hover:text-heading-color transition-colors">Contact Us</Link></li> */} 
            </ul>
          </div>
          
          {/* Column 3: Legal/Info */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-heading-color mb-4">Information</h3>
            <ul className="space-y-2">
              <li><Link href="/faq" className="hover:text-heading-color transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-heading-color transition-colors">Contact Us</Link></li>
              {/* <li><Link href="/shipping-returns" className="hover:text-heading-color transition-colors">Shipping & Returns</Link></li> */}
              {/* <li><Link href="/privacy-policy" className="hover:text-heading-color transition-colors">Privacy Policy</Link></li> */}
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright */}
        <div className="mt-12 pt-8 border-t border-primary-bg text-center">
          <p>&copy; {new Date().getFullYear()} Meghkala. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}