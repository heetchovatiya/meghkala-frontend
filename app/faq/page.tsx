// app/faq/page.tsx

import { FAQ } from '@/components/common/FAQ';

export default function FAQPage() {
  const faqItems = [
    {
      id: '1',
      question: 'How do I place an order?',
      answer: 'Simply browse our collection, select your desired items, add them to your cart, and proceed to checkout. You can create an account for faster checkout or checkout as a guest.'
    },
    {
      id: '2',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, UPI, net banking, and digital wallets. All payments are processed securely through our encrypted payment gateway.'
    },
    {
      id: '3',
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-5 business days within India. Express shipping is available for 1-2 business days. International shipping takes 7-14 business days depending on the destination.'
    },
    {
      id: '4',
      question: 'Do you offer free shipping?',
      answer: 'Yes! We offer free shipping on all orders above ₹2,000 within India. International orders above ₹5,000 also qualify for free shipping.'
    },
    {
      id: '5',
      question: 'Can I return or exchange items?',
      answer: 'We offer a 30-day return policy for unused items in original packaging. Custom or personalized items cannot be returned. Please contact our customer service for return requests.'
    },
    {
      id: '6',
      question: 'Are your products authentic?',
      answer: 'Absolutely! All our products are authentic and sourced directly from verified artists and manufacturers. We provide certificates of authenticity for premium pieces.'
    },
    {
      id: '7',
      question: 'Do you offer custom orders?',
      answer: 'Yes, we work with our artists to create custom pieces based on your requirements. Please contact us with your specifications and we\'ll provide a quote and timeline.'
    },
    {
      id: '8',
      question: 'How can I track my order?',
      answer: 'Once your order ships, you\'ll receive a tracking number via email and SMS. You can also track your order status in your account dashboard.'
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-heading-color mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-text-color max-w-2xl mx-auto">
            Find answers to common questions about our products, shipping, returns, and more
          </p>
        </div>

        {/* FAQ Content */}
        <FAQ 
          items={faqItems}
          title=""
          subtitle=""
        />
      </div>
    </div>
  );
}
