// app/shipping-returns/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping & Returns | Meghkala',
};

export default function ShippingReturnsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-16">
      <div className="max-w-3xl mx-auto prose prose-lg prose-p:text-text-color prose-h1:font-serif prose-h1:text-heading-color prose-h2:font-serif prose-h2:text-heading-color">
        <h1>Shipping & Returns</h1>
        
        <h2>Shipping Information</h2>
        <p>We currently ship to all locations within India. As our pieces are handcrafted, please allow 3-5 business days for your order to be prepared for shipment. Once dispatched, you will receive a tracking number via email.</p>
        
        <h3>Shipping Charges</h3>
        <ul>
          <li><strong>Free Shipping:</strong> On orders above ₹700</li>
          <li><strong>Standard Shipping:</strong> ₹50 for orders below ₹700</li>
          <li><strong>Delivery Time:</strong> 3-5 business days</li>
        </ul>

        <h2>Returns Policy</h2>
        <p>Due to the unique, handmade nature of our products, we do not accept returns or exchanges. However, if your item arrives damaged, please contact us at <a href="mailto:support@meghkala.com">support@meghkala.com</a> within 48 hours of delivery with photos of the damage, and we will be happy to assist you.</p>
      </div>
    </div>
  );
}