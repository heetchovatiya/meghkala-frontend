// app/categories/page.tsx

import { getCategories } from '@/lib/api';
import { CategoryCard, Category } from '@/components/products/CategoryCard';

export default async function CategoriesPage() {
  let categories: Category[] = [];
  let error: string | null = null;

  try {
    categories = await getCategories();
  } catch (err: any) {
    error = "Failed to load categories. Please try again later.";
  }

  return (
    <div className="container mx-auto px-6 py-16 md:py-24">
      {/* Page Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-heading-color">
          Browse by Category
        </h1>
        <p className="mt-4 text-lg text-text-color max-w-2xl mx-auto">
          Find the perfect piece by exploring our curated collections.
        </p>
      </div>

      {/* Categories Grid */}
      {error ? (
        <div className="text-center bg-red-100 text-red-700 p-4 rounded-md">
          <p>{error}</p>
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map(category => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      ) : (
        <p className="text-center text-text-color">No categories found.</p>
      )}
    </div>
  );
}