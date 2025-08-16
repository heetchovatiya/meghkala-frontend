// components/common/Input.tsx
import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export function Input({ label, id, ...props }: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text-color mb-1">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="w-full px-4 py-2 bg-primary-bg border border-secondary-bg rounded-md 
                   text-heading-color placeholder-text-color/50 
                   focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
      />
    </div>
  );
}