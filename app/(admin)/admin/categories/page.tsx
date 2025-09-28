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
  parentCategory?: string;
  isActive?: boolean;
  image?: string;
  sortOrder?: number;
}

interface Subcategory extends Category {
  parentCategory: string;
}

export default function AdminCategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [selectedParentCategory, setSelectedParentCategory] = useState('');
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'categories' | 'subcategories'>('categories');

  const fetchCategories = () => {
    api.getCategories(true)
      .then(data => {
        console.log('Fetched categories:', data);
        setCategories(data);
      })
      .catch(err => {
        console.error('Failed to load categories:', err);
        toast.error("Failed to load categories.");
      })
      .finally(() => setIsLoading(false));
  };

  const fetchSubcategories = () => {
    api.getCategories(false)
      .then(data => {
        const subs = data.filter((cat: Category) => cat.parentCategory);
        setSubcategories(subs);
      })
      .catch(err => toast.error("Failed to load subcategories."));
  };

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  const handleImageUpload = async (file: File): Promise<string> => {
    if (!token) throw new Error('No authentication token');
    
    setIsUploading(true);
    try {
      console.log('Starting image upload for file:', file.name, 'Size:', file.size, 'Type:', file.type);
      const result = await api.uploadImage(token, file);
      console.log('Upload result:', result);
      
      if (!result.imageUrl) {
        throw new Error('No image URL returned from upload');
      }
      
      return result.imageUrl;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newCategoryName.trim()) return;

    try {
      let imageUrl = '';
      if (categoryImage) {
        console.log('Uploading image:', categoryImage.name);
        imageUrl = await handleImageUpload(categoryImage);
        console.log('Image uploaded successfully:', imageUrl);
      }

      const categoryData = { 
        name: newCategoryName,
        ...(imageUrl && { image: imageUrl })
      };
      
      console.log('Creating category with data:', categoryData);
      await api.adminCreateCategory(token, categoryData);
      toast.success(`Category "${newCategoryName}" created!`);
      setNewCategoryName('');
      setCategoryImage(null);
      fetchCategories(); // Refresh the list
    } catch (error: any) {
      console.error('Error creating category:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleAddSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newSubcategoryName.trim() || !selectedParentCategory) return;

    try {
      await api.adminCreateCategory(token, { 
        name: newSubcategoryName, 
        parentCategory: selectedParentCategory 
      });
      toast.success(`Subcategory "${newSubcategoryName}" created!`);
      setNewSubcategoryName('');
      setSelectedParentCategory('');
      fetchSubcategories(); // Refresh the list
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

  const handleDeleteSubcategory = async (subcategoryId: string, subcategoryName: string) => {
    if (!token || !window.confirm(`Are you sure you want to delete the "${subcategoryName}" subcategory?`)) return;
    
    try {
      await api.adminDeleteCategory(token, subcategoryId);
      toast.success(`Subcategory "${subcategoryName}" deleted.`);
      fetchSubcategories(); // Refresh the list
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  if (isLoading) return <div>Loading categories...</div>;

  return (
    <div>
      <h1 className="text-3xl font-serif text-heading-color mb-8">Manage Categories & Subcategories</h1>
      
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'categories'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab('subcategories')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'subcategories'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Subcategories
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'categories' && (
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
              placeholder="e.g., Electronics"
              required
            />
            
            {/* Category Image Upload */}
            <div>
              <label className="block text-sm font-medium text-text-color mb-2">Category Image (Optional)</label>
              <div className="space-y-2">
                {categoryImage && (
                  <div className="relative">
                    <img 
                      src={URL.createObjectURL(categoryImage)} 
                      alt="Category preview" 
                      className="w-20 h-20 object-cover rounded-md border border-secondary-bg"
                    />
                    <button
                      type="button"
                      onClick={() => setCategoryImage(null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCategoryImage(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-text-color file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-accent file:text-white hover:file:bg-accent-hover"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isUploading}
              className="w-full mt-4 bg-accent text-white font-semibold py-2 px-4 rounded-md hover:bg-accent-hover disabled:bg-accent/50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Add Category'}
            </button>
            </form>
          </div>
          {/* Category List */}
          <div className="md:col-span-2 bg-primary-bg p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-heading-color mb-4">Existing Categories</h2>
            <div className="space-y-2">
              {categories.map(cat => (
                <div key={cat._id} className="flex justify-between items-center p-3 bg-secondary-bg/50 rounded-md">
                  <div className="flex items-center gap-3">
                    {cat.image ? (
                      <img 
                        src={cat.image} 
                        alt={cat.name} 
                        className="w-10 h-10 object-cover rounded-md border border-secondary-bg"
                        onError={(e) => {
                          console.error('Failed to load image:', cat.image);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-md border border-secondary-bg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                    <span className="text-heading-color">{cat.name}</span>
                  </div>
                  <button onClick={() => handleDeleteCategory(cat._id, cat.name)} className="text-red-500 hover:underline">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'subcategories' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Add Subcategory Form */}
          <div className="md:col-span-1">
            <form onSubmit={handleAddSubcategory} className="bg-primary-bg p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-heading-color mb-4">Add New Subcategory</h2>
              <div className="mb-4">
                <label htmlFor="parentCategory" className="block text-sm font-medium text-text-color mb-1">Parent Category</label>
                <select
                  id="parentCategory"
                  value={selectedParentCategory}
                  onChange={(e) => setSelectedParentCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-primary-bg border border-secondary-bg rounded-md focus:ring-2 focus:ring-accent outline-none transition"
                  required
                >
                  <option value="">-- Select a category --</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <Input
                id="newSubcategoryName"
                label="Subcategory Name"
                value={newSubcategoryName}
                onChange={(e) => setNewSubcategoryName(e.target.value)}
                placeholder="e.g., Smartphones"
                required
              />
              <button type="submit" className="w-full mt-4 bg-accent text-white font-semibold py-2 px-4 rounded-md hover:bg-accent-hover">
                Add Subcategory
              </button>
            </form>
          </div>
          {/* Subcategory List */}
          <div className="md:col-span-2 bg-primary-bg p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-heading-color mb-4">Existing Subcategories</h2>
            <div className="space-y-2">
              {subcategories.map(sub => {
                const parentCategory = categories.find(cat => cat._id === sub.parentCategory);
                return (
                  <div key={sub._id} className="flex justify-between items-center p-3 bg-secondary-bg/50 rounded-md">
                    <div>
                      <span className="text-heading-color font-medium">{sub.name}</span>
                      <span className="text-sm text-gray-500 ml-2">({parentCategory?.name})</span>
                    </div>
                    <button onClick={() => handleDeleteSubcategory(sub._id, sub.name)} className="text-red-500 hover:underline">
                      Delete
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}