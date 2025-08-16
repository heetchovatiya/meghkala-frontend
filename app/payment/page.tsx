// app/payment/page.tsx
"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useState, useRef } from 'react';
import * as api from '@/lib/api';
import toast from 'react-hot-toast';
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuth();
  const { clearCart } = useCart();

  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !orderId || !token) {
      return toast.error("Please select a screenshot file.");
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading screenshot...");

    try {
      const result = await api.uploadPaymentScreenshot(token, orderId, selectedFile);
      toast.success(result.message, { id: toastId, duration: 4000 });
      clearCart(); // Now clear the cart
      router.push(`/order-success/${orderId}`);
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`, { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  // Redirect if essential data is missing
  if (!orderId || !amount) {
    return <div className="text-center py-20">Invalid payment link.</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 text-center">
      <h1 className="text-4xl font-serif text-heading-color">Complete Your Payment</h1>
      <p className="mt-4 text-lg text-text-color">
        To finalize your order, please pay:
      </p>
      <p className="text-5xl font-bold text-accent my-4">
        ₹{parseFloat(amount).toFixed(2)}
      </p>
      <p className="text-text-color">using the UPI details below.</p>

      <div className="my-8 inline-block bg-white p-4 rounded-lg shadow-md">
        {/* Add your QR code image to the /public folder */}
        <Image src="/upi-qr-code.png" alt="UPI QR Code" width={250} height={250} />
      </div>

      <p className="text-lg text-heading-color font-semibold">
        UPI ID: <span className="font-mono text-accent">your-name@okhdfcbank</span>
      </p>
      
      <div className="mt-12 max-w-lg mx-auto p-6 bg-secondary-bg/60 rounded-lg">
        <h2 className="text-2xl font-serif text-heading-color mb-4">Upload Payment Screenshot</h2>
        <p className="text-sm text-text-color mb-4">
          After payment, please upload a screenshot of your confirmation screen.
        </p>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden" 
          accept="image/*" 
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full mb-4 bg-primary-bg border border-secondary-bg py-3 rounded-md"
        >
          {selectedFile ? `Selected: ${selectedFile.name}` : 'Choose Screenshot'}
        </button>
        <button 
          onClick={handleUpload}
          disabled={isUploading || !selectedFile}
          className="w-full bg-accent text-white ..."
        >
          {isUploading ? "Uploading..." : "Confirm & Finish"}
        </button>
      </div>
    </div>
  );
}
