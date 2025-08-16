// components/products/SearchBar.tsx
"use client"; // This component requires state and browser APIs, so it must be a Client Component.

import { useState, FormEvent } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

export function SearchBar() {
  // Next.js hooks to interact with the URL
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize the input's state with the current 'keyword' from the URL.
  // This ensures that if you refresh the page, the search term remains in the box.
  const [searchTerm, setSearchTerm] = useState(searchParams.get('keyword') || '');

  // This function runs when the user submits the form (e.g., presses Enter)
  const handleSearch = (e: FormEvent) => {
    e.preventDefault(); // Prevent the browser's default form submission (full page reload)

    // Create a mutable copy of the current URL search parameters.
    // This is crucial because it preserves other active filters, like 'category'.
    const params = new URLSearchParams(searchParams.toString());

    if (searchTerm) {
      // If the user typed something, set the 'keyword' parameter.
      params.set('keyword', searchTerm);
    } else {
      // If the user submitted an empty search box, remove the 'keyword' parameter to clear the search.
      params.delete('keyword');
    }

    // Navigate to the new URL. This will cause the ProductsPage to re-render
    // with the new searchParams, triggering a new data fetch on the server.
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <input 
        type="text" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for art..."
        className="w-full pl-10 pr-4 py-3 bg-primary-bg border border-secondary-bg rounded-full 
                   text-heading-color placeholder-text-color/60 
                   focus:ring-2 focus:ring-accent focus:border-accent 
                   outline-none transition-shadow"
      />
      {/* The search icon is positioned absolutely inside the input's left padding */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={20} className="text-text-color/50" />
      </div>
      {/* You could add a visible search button here if desired, but Enter key submission is standard */}
    </form>
  );
}