// app/(admin)/admin/categories/page.tsx
"use client";

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import * as api from '@/lib/api';
import { Input } from '@/components/common/Input';
import toast from 'react-hot-toast';

interface Category {
  _id: string;
  name: string;
}

export default function AdminCategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = () => {
    api.getCategories()
      .then(data => setCategories(data))
      .catch(err => toast.error("Failed to load categories."))
      .finally(() => setIsLoading(false));
  };

  useEffect(fetchCategories, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newCategoryName.trim()) return;

    try {
      await api.adminCreateCategory(token, { name: newCategoryName });
      toast.success(`Category "${newCategoryName}" created!`);
      setNewCategoryName('');
      fetchCategories(); // Refresh the list
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };
  
  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (!token || !window.confirm(`Are you sure you want to delete the "${categoryName}" category?`)) return;
    
    try {
      await api.adminDeleteCategory(token, categoryId);
      toast.success(`Category "${categoryName}" deleted.`);
      fetchCategories(); // Refresh the list
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  if (isLoading) return <div>Loading categories...</div>;

  return (
    <div>
      <h1 className="text-3xl font-serif text-heading-color mb-8">Manage Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Add Category Form */}
        <div className="md:col-span-1">
          <form onSubmit={handleAddCategory} className="bg-primary-bg p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-heading-color mb-4">Add New Category</h2>
            <Input
              id="newCategoryName"
              label="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="e.g., Paintings"
              required
            />
            <button type="submit" className="w-full mt-4 bg-accent text-white font-semibold py-2 px-4 rounded-md hover:bg-accent-hover">
              Add Category
            </button>
          </form>
        </div>
        {/* Category List */}
        <div className="md:col-span-2 bg-primary-bg p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-heading-color mb-4">Existing Categories</h2>
          <div className="space-y-2">
            {categories.map(cat => (
              <div key={cat._id} className="flex justify-between items-center p-3 bg-secondary-bg/50 rounded-md">
                <span className="text-heading-color">{cat.name}</span>
                <button onClick={() => handleDeleteCategory(cat._id, cat.name)} className="text-red-500 hover:underline">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}