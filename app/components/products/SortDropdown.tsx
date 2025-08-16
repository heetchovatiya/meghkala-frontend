// components/products/SortDropdown.tsx
"use client";

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import { Fragment } from 'react';

const sortOptions = [
  { name: 'Newest', value: 'newest' },
  { name: 'Price: Low to High', value: 'price-asc' },
  { name: 'Price: High to Low', value: 'price-desc' },
];

// ✅ DEFINE THE PROPS INTERFACE
// This "contract" tells TypeScript that this component can accept an optional onSortChange function.
interface SortDropdownProps {
  onSortChange?: () => void; // The '?' makes the prop optional
}

// ✅ Use the new interface to type the component's props
export function SortDropdown({ onSortChange }: SortDropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'newest';

  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sortValue);
    router.push(`${pathname}?${params.toString()}`);

    // ✅ Call the callback function if it was provided.
    // This is what closes the mobile filter sheet.
    if (onSortChange) {
      onSortChange();
    }
  };

  const currentSortName = sortOptions.find(opt => opt.value === currentSort)?.name || 'Newest';

  return (
    <Menu as="div" className="relative inline-block text-left w-full sm:w-auto">
      <div>
        <Menu.Button className="inline-flex w-full justify-between items-center rounded-md bg-primary-bg px-4 py-3 text-md font-medium text-heading-color shadow-sm border border-secondary-bg hover:bg-secondary-bg/60">
          {currentSortName}
          <ChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>
      <Transition 
        as={Fragment} 
        enter="transition ease-out duration-100" 
        enterFrom="transform opacity-0 scale-95" 
        enterTo="transform opacity-100 scale-100" 
        leave="transition ease-in duration-75" 
        leaveFrom="transform opacity-100 scale-100" 
        leaveTo="transform opacity-0 scale-95"
      >
        {/* Adjusted width and origin for better placement on desktop */}
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-primary-bg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-30">
          <div className="py-1">
            {sortOptions.map(option => (
              <Menu.Item key={option.value}>
                {({ active }) => (
                  <button 
                    onClick={() => handleSortChange(option.value)} 
                    className={`${ active ? 'bg-secondary-bg' : ''} group flex w-full items-center px-4 py-2 text-sm text-left`}
                  >
                    {option.name}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}