// components/common/Button.tsx

import Link from 'next/link';

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'default' | 'outline';
  disabled?: boolean;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Button({ 
  href, 
  onClick, 
  type = 'button',
  variant = 'default',
  disabled = false,
  children, 
  size = 'md',
  className = ''
}: ButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    default: 'bg-accent text-white hover:bg-accent-hover',
    outline: 'bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-white'
  };

  const baseClasses = `
    inline-block font-semibold rounded-md
    transition-all duration-300 ease-in-out
    hover:shadow-lg hover:-translate-y-0.5
    focus:outline-none focus:ring-4 focus:ring-accent/50
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `;

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {children}
    </button>
  );
}