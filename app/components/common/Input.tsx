// components/common/Input.tsx

import React from 'react';

// ✅ MODIFIED: Add 'error' to the props interface
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string; // Optional string for validation errors
}

export function Input({ id, label, error, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-heading-color">
        {label}
      </label>
      <input
        id={id}
        {...props}
        // ✅ MODIFIED: Add a conditional className for error state
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent ${
          error ? 'border-red-500' : 'border-secondary-bg'
        }`}
      />
      {/* ✅ ADDED: Conditionally render the error message */}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}