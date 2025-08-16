// components/common/Logo.tsx

import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="text-2xl font-serif font-bold text-heading-color tracking-wide hover:text-accent transition-colors">
        Meghkala
    </Link>
  );
}