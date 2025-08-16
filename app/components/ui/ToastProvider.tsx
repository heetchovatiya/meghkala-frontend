// components/ui/ToastProvider.tsx
"use client";

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: '#333333', // heading-color
          color: '#F8F7F4', // primary-bg
        },
      }}
    />
  );
}