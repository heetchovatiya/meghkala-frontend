// app/faq/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Meghkala',
};

export default function FAQPage() {
  return (
    <div className="bg-primary-bg">
      <div className="container mx-auto px-4 sm:px-6 py-16 md:py-24">
        
        {/* Page Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-heading-color">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-text-color">
            Have a question? We're here to help.
          </p>
        </div>

        {/* FAQ Content */}
        <div className="max-w-3xl mx-auto">
          {/* ✅ The 'prose' classes will automatically style all the HTML tags inside this div */}
          <div className="prose prose-lg prose-p:text-text-color prose-headings:text-heading-color 
                          prose-headings:font-serif prose-strong:text-heading-color">
            
            <h2>What are your products made of?</h2>
            <p>All our crochet creations are made with premium, skin-friendly cotton and wool yarns to ensure durability and comfort.</p>

            <h2>Do you take custom orders?</h2>
            <p>Yes! We love making personalized crochet pieces. You can share your design, color, or size preferences, and we’ll create something just for you.</p>

            <h2>Are the items truly handmade?</h2>
            <p><strong>Absolutely.</strong> Every single item at Meghkala is handcrafted by our founder, Megha Chovatiya. This means each piece is unique and carries the subtle marks of its creation process, which we believe is part of its charm.</p>
            
            <h2>How do I take care of crochet products?</h2>
            <p>Hand wash gently with mild detergent and cold water. Do not wring. Lay flat to dry to maintain the shape and softness.</p>

            <h2>Do you ship all over India?</h2>
            <p>Yes, we provide delivery across India. Shipping charges may vary depending on your location.</p>
            
            
            <h2>What is your return policy?</h2>
            <p>Due to the unique, handmade nature of our products, we do not accept returns or exchanges. However, if your item arrives damaged, please <a href="/contact" className="text-accent hover:underline">contact us</a> within 48 hours of delivery with opening video of parcel 📦 , cut video or only photos of damaged piece will not acceptable by us , and we will be happy to assist you.</p>

            {/* Add more questions and answers here */}

          </div>
        </div>
      </div>
    </div>
  );
}