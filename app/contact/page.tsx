// app/contact/page.tsx
"use client"; // This page has an interactive form

import { useState } from 'react';
import { Metadata } from 'next';
import { Input } from '@/components/common/Input';
import toast from 'react-hot-toast';

// We can't export metadata from a client component, 
// but you could create a layout.tsx for this route to add it.

export default function ContactPage() {
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Sending...');
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/xeozwjbw', { // <-- PASTE YOUR FORMSPREE URL HERE
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus('Message sent successfully!');
        toast.success('Thank you for your message!');
        form.reset();
      } else {
        const responseData = await response.json();
        if (responseData.errors) {
            setStatus(responseData.errors.map((error: any) => error.message).join(', '));
            toast.error("An error occurred.");
        } else {
            setStatus("Oops! There was a problem submitting your form");
            toast.error("An error occurred.");
        }
      }
    } catch (error) {
      setStatus("Oops! There was a problem submitting your form");
      toast.error("An error occurred.");
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-heading-color">Contact Us</h1>
        <p className="mt-4 text-lg text-text-color max-w-2xl mx-auto">
          We'd love to hear from you. Please fill out the form below, and we'll get back to you as soon as possible.
        </p>
      </div>
      <div className="max-w-2xl mx-auto bg-secondary-bg/60 p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* 'name' is a special field for Formspree */}
            <Input id="name" name="name" label="Your Name" type="text" required />
            {/* '_replyto' is a special field for Formspree to set the reply-to email */}
            <Input id="email" name="_replyto" label="Your Email" type="email" required />
          </div>
          <div className="mt-6">
            <label htmlFor="message" className="block text-sm font-medium text-text-color mb-1">Message</label>
            <textarea id="message" name="message" rows={5} required
                      className="w-full px-4 py-2 bg-primary-bg border border-secondary-bg rounded-md focus:ring-2 focus:ring-accent outline-none transition" />
          </div>
          <div className="mt-6 text-right">
            <button type="submit" className="bg-accent text-white font-semibold py-3 px-8 rounded-md hover:bg-accent-hover transition">
              {status === 'Sending...' ? 'Sending...' : 'Send Message'}
            </button>
          </div>
          {status && <p className="text-center mt-4 text-sm">{status}</p>}
        </form>
      </div>
    </div>
  );
}