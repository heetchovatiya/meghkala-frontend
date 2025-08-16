// app/payment/page.tsx
"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useState, useRef, useEffect } from 'react'; // ✅ Import useEffect
import * as api from '@/lib/api';
import toast from 'react-hot-toast';
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import { UploadCloud } from 'lucide-react'; // For a nicer button icon

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

  // ✅ FIX: Added a robust check to handle invalid/missing URL parameters gracefully.
  // This runs inside a useEffect to prevent errors during server-side rendering.
  useEffect(() => {
    if (!orderId || !amount || isNaN(parseFloat(amount))) {
      toast.error("Invalid or expired payment link. Redirecting...");
      router.push('/');
    }
  }, [orderId, amount, router]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Optional: Check file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File is too large. Please upload an image under 5MB.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !orderId || !token) {
      return toast.error("Please select a screenshot file to upload.");
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading screenshot...");

    try {
      const result = await api.uploadPaymentScreenshot(token, orderId, selectedFile);
      toast.success(result.message, { id: toastId, duration: 4000 });
      clearCart();
      router.push(`/order-success/${orderId}`);
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`, { id: toastId });
      setIsUploading(false); // Only set to false on failure, success will navigate away
    }
  };

  // Render a loading state while the useEffect check runs
  if (!orderId || !amount) {
    return <div className="text-center py-20">Verifying payment details...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 text-center">
      <h1 className="text-4xl font-serif text-heading-color">Complete Your Payment</h1>
      <p className="mt-4 text-lg text-text-color">To finalize your order, please pay:</p>
      
      <p className="text-5xl font-bold text-accent my-4">
        ₹{parseFloat(amount).toFixed(2)}
      </p>
      
      <p className="text-text-color">using the UPI details below.</p>

      <div className="my-8 inline-block bg-white p-4 rounded-lg shadow-md">
        {/* ✅ UPDATE THIS: Replace with your actual QR code file from the /public folder */}
        <Image src="/qr-code.jpg" alt="UPI QR Code" width={250} height={250} priority />
      </div>

      <p className="text-lg text-heading-color font-semibold">
        {/* ✅ UPDATE THIS: Replace with your actual UPI ID */}
        UPI ID: <span className="font-mono text-accent">9999999999@axis.com</span>
      </p>
      
      <div className="mt-12 max-w-lg mx-auto p-6 bg-secondary-bg/60 rounded-lg shadow-inner">
        <h2 className="text-2xl font-serif text-heading-color mb-2">Upload Payment Screenshot</h2>
        <p className="text-sm text-text-color mb-6">
          After paying, please upload a screenshot of your confirmation screen below.
        </p>
        
        {/* Hidden file input */}
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        
        {/* Styled "Choose File" button */}
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-2 mb-4 bg-primary-bg border-2 border-dashed border-secondary-bg hover:border-accent py-6 rounded-md transition-colors"
        >
          <UploadCloud size={32} className="text-text-color/70" />
          <span className="font-semibold text-heading-color">
            {selectedFile ? 'Change Screenshot' : 'Choose Screenshot'}
          </span>
          {selectedFile && <span className="text-sm text-text-color truncate max-w-xs">{selectedFile.name}</span>}
        </button>
        
        {/* "Confirm & Finish" button */}
        <button 
          onClick={handleUpload}
          disabled={isUploading || !selectedFile}
          className="w-full bg-accent text-white font-semibold rounded-md py-3 text-lg
                     transition-all duration-300 ease-in-out hover:bg-accent-hover
                     disabled:bg-accent/50 disabled:cursor-not-allowed"
        >
          {isUploading ? "Uploading..." : "Confirm & Finish"}
        </button>
      </div>
    </div>
  );
}