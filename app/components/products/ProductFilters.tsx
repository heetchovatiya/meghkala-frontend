// components/products/ProductFilters.tsx
"use client";

import { useState, useEffect } from 'react';
import * as api from '@/lib/api';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Menu, Transition } from '@headlessui/react'; // Import from Headless UI
import { ChevronDown } from 'lucide-react';
import { Fragment } from 'react';

interface Category {
  _id: string;
  name: string;
}
export function ProductFilters() {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  useEffect(() => {
    api.getCategories().then(setCategories);
  }, []);

 const handleFilterChange = (categoryId: string) => {

    const params = new URLSearchParams(searchParams.toString());

    if (categoryId) {
      params.set('category', categoryId);
    } else {

      params.delete('category');
    }

    router.push(`${pathname}?${params.toString()}`);
  };  const selectedCategoryName = categories.find(c => c._id === currentCategory)?.name || "All Categories";

  return (
    <div>
    <Menu as="div" className="relative inline-block text-left w-full">
        <div>
          <Menu.Button className="inline-flex w-full justify-between items-center rounded-md bg-primary-bg px-4 py-3 text-md font-medium text-heading-color shadow-sm border border-secondary-bg hover:bg-secondary-bg/60">
            {selectedCategoryName}
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
          <Menu.Items className="absolute left-0 mt-2 w-full origin-top-right rounded-md bg-primary-bg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button onClick={() => handleFilterChange('')} className={`${ active ? 'bg-secondary-bg' : ''} group flex w-full items-center px-4 py-2 text-md`}>
                    All Categories
                  </button>
                )}
              </Menu.Item>
              {categories.map(category => (
                <Menu.Item key={category._id}>
                  {({ active }) => (
                    <button onClick={() => handleFilterChange(category._id)} className={`${ active ? 'bg-secondary-bg' : ''} group flex w-full items-center px-4 py-2 text-md`}>
                      {category.name}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}