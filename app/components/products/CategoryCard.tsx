// components/products/CategoryCard.tsx
import Link from 'next/link';

export interface Category {
  _id: string;
  name: string;
  image?: string;
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
        Background image or fallback gradient background
      */}
      {category.image ? (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${category.image})` }}
        ></div>
      ) : (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-secondary-bg to-primary-bg"
        ></div>
      )}

      {/* 
        Dark overlay to ensure text readability over images
      */}
      <div 
        className="absolute inset-0 bg-black/30 group-hover:bg-black/40 
                   transition-all duration-300"
      ></div>
      
      {/* 
        Flexbox container to perfectly center the text both horizontally and vertically.
      */}
      <div className="relative h-full w-full flex items-center justify-center p-4">
        <h3 className="text-3xl font-serif text-white text-center font-bold
                       transition-transform duration-300 group-hover:scale-105
                       drop-shadow-lg">
          {category.name}
        </h3>
      </div>
    </Link>
  );
}