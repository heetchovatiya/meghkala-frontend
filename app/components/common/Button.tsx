// components/common/Button.tsx

import Link from 'next/link';

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  size?: 'md' | 'lg';
}

export function Button({ href, children, size = 'md' }: ButtonProps) {
  const sizeClasses = size === 'lg' ? 'px-8 py-4 text-lg' : 'px-6 py-3 text-base';

  return (
    <Link
      href={href}
      className={`
        inline-block bg-accent text-white font-semibold rounded-md
        transition-all duration-300 ease-in-out
        hover:bg-accent-hover hover:shadow-lg hover:-translate-y-0.5
        focus:outline-none focus:ring-4 focus:ring-accent/50
        ${sizeClasses}
      `}
    >
      {children}
    </Link>
  );
}