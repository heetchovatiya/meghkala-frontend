// components/products/CategoryCard.tsx
import Link from 'next/link';

export interface Category {
  _id: string;
  name: string;
}

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link 
      href={`/products?category=${category._id}`} 
      className="group relative block aspect-[4/3] w-full overflow-hidden rounded-lg shadow-md
                 transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl"
    >
      {/* 
        The gradient background. 
        It starts from a slightly darker version of your secondary background (`#E9E4DE`)
        and fades into your primary background (`#F8F7F4`).
      */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-secondary-bg to-primary-bg"
      ></div>

      {/* 
        A subtle overlay that becomes slightly more opaque on hover,
        making the text pop.
      */}
      <div 
        className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 
                   transition-opacity duration-300"
      ></div>
      
      {/* 
        Flexbox container to perfectly center the text both horizontally and vertically.
      */}
      <div className="relative h-full w-full flex items-center justify-center p-4">
        <h3 className="text-3xl font-serif text-heading-color text-center 
                       transition-transform duration-300 group-hover:scale-105">
          {category.name}
        </h3>
      </div>
    </Link>
  );
}