// components/products/ProductForm.tsx
"use client";

import { useState, useEffect } from 'react';
import * as api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { Input } from '@/components/common/Input';
import { Product } from './ProductCard';
import { UploadCloud } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  parentCategory?: string;
}

interface Subcategory {
  _id: string;
  name: string;
  parentCategory: string;
}

interface ProductFormProps {
  initialData?: Product | null;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export function ProductForm({ initialData, onSubmit, isSubmitting }: ProductFormProps) {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // ✅ FORM STATE ALIGNED WITH THE NEW SCHEMA
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    quantity: '',
    description: '',
    images: [] as string[],
    coverImageIndex: 0,
    availability: 'IN_STOCK',
    category: '',
    subcategory: '',
    sku: '',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    tags: [] as string[],
    isFeatured: false,
  });

   useEffect(() => {
    api.getCategories(true).then(setCategories).catch(() => toast.error("Could not load categories."));
  }, []);

  // Load subcategories when category changes
  useEffect(() => {
    if (formData.category) {
      api.getSubcategories(formData.category).then(setSubcategories).catch(() => setSubcategories([]));
    } else {
      setSubcategories([]);
    }
  }, [formData.category]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        price: String(initialData.price),
        quantity: String(initialData.quantity),
        description: initialData.description || '',
        images: initialData.images || [],
        coverImageIndex: 0,
        availability: initialData.availability || 'IN_STOCK',
        category: initialData.category?._id || '',
        subcategory: initialData.subcategory?._id || '',
        sku: initialData.sku || '',
        weight: String(initialData.weight || ''),
        dimensions: {
          length: String(initialData.dimensions?.length || ''),
          width: String(initialData.dimensions?.width || ''),
          height: String(initialData.dimensions?.height || '')
        },
        tags: initialData.tags || [],
        isFeatured: initialData.isFeatured || false,
      });
    } else {
      setFormData({
        title: '', price: '', quantity: '', description: '', images: [], coverImageIndex: 0, availability: 'IN_STOCK', 
        category: '', subcategory: '', sku: '', weight: '', dimensions: { length: '', width: '', height: '' }, 
        tags: [], isFeatured: false,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name.startsWith('dimensions.')) {
      const dimensionField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        dimensions: { ...prev.dimensions, [dimensionField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !token) return;
    
    setIsUploading(true);
    const toastId = toast.loading('Uploading images...');
    
    try {
      const uploadPromises = Array.from(files).map(file => api.uploadImage(token, file));
      const results = await Promise.all(uploadPromises);
      const newImageUrls = results.map(result => result.imageUrl);
      
      setFormData(prev => ({ 
        ...prev, 
        images: [...prev.images, ...newImageUrls] 
      }));
      
      toast.success(`${newImageUrls.length} image(s) uploaded!`, { id: toastId });
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`, { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      const newCoverIndex = prev.coverImageIndex >= newImages.length ? 0 : prev.coverImageIndex;
      return {
        ...prev,
        images: newImages,
        coverImageIndex: newCoverIndex
      };
    });
  };

  const handleSetCoverImage = (index: number) => {
    setFormData(prev => ({ ...prev, coverImageIndex: index }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) return toast.error("Please select a category.");
    if (formData.images.length === 0) return toast.error("Please upload at least one image.");
    
    onSubmit({ 
        ...formData, 
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        dimensions: {
          length: formData.dimensions.length ? parseFloat(formData.dimensions.length) : undefined,
          width: formData.dimensions.width ? parseFloat(formData.dimensions.width) : undefined,
          height: formData.dimensions.height ? parseFloat(formData.dimensions.height) : undefined,
        }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Name Input */}
      <Input id="title" name="title" label="Product Name" value={formData.title} onChange={handleChange} required />
      
      {/* Grid for Price, Quantity, and SKU */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input id="price" name="price" label="Price (₹)" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
        <Input id="quantity" name="quantity" label="Stock Quantity" type="number" value={formData.quantity} onChange={handleChange} required placeholder="e.g., 10" />
        <Input id="sku" name="sku" label="SKU" value={formData.sku} onChange={handleChange} placeholder="e.g., PROD-001" />
      </div>
      
      {/* Description Textarea */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-text-color mb-1">Description</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4}
                  className="w-full px-4 py-2 bg-primary-bg border border-secondary-bg rounded-md focus:ring-2 focus:ring-accent outline-none transition" />
      </div>
      
      {/* --- ENHANCED IMAGE UPLOAD UI --- */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-text-color">Product Images</label>
        {/* Container for image previews */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-secondary-bg/50 rounded-md min-h-[8rem]">
            {formData.images.length > 0 ? (
                formData.images.map((imgUrl, index) => (
                    <div key={index} className="relative group">
                        <img 
                            src={imgUrl} 
                            alt={`Product preview ${index + 1}`} 
                            className={`w-full h-24 object-cover rounded-md bg-secondary-bg shadow-sm border-2 ${
                                index === formData.coverImageIndex ? 'border-accent' : 'border-transparent'
                            }`}
                        />
                        {/* Cover image indicator */}
                        {index === formData.coverImageIndex && (
                            <div className="absolute top-1 left-1 bg-accent text-white text-xs px-2 py-1 rounded">
                                Cover
                            </div>
                        )}
                        {/* Action buttons */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={() => handleSetCoverImage(index)}
                                className="bg-white text-accent p-1 rounded hover:bg-accent hover:text-white transition-colors"
                                title="Set as cover image"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
                                title="Remove image"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-full flex items-center justify-center text-sm text-text-color p-4">
                    No images uploaded yet.
                </div>
            )}
        </div>
        {/* The upload button/label */}
        <label htmlFor="imageUpload" 
               className={`relative flex justify-center items-center gap-2 cursor-pointer bg-primary-bg rounded-md font-medium text-accent hover:text-accent-hover focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-accent p-3 border border-dashed border-secondary-bg text-center w-full ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <UploadCloud className="h-5 w-5" />
          <span>{isUploading ? 'Uploading...' : 'Add Images'}</span>
          <input 
            id="imageUpload" 
            name="imageUpload" 
            type="file" 
            className="sr-only" 
            onChange={handleImageUpload} 
            disabled={isUploading} 
            accept="image/*" 
            multiple
          />
        </label>
        <p className="text-xs text-gray-500">You can select multiple images at once. The first image will be set as the cover image by default.</p>
      </div>
      
      {/* Category and Subcategory Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-text-color mb-1">Category</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange} required
                  className="w-full px-4 py-2 bg-primary-bg border border-secondary-bg rounded-md focus:ring-2 focus:ring-accent outline-none transition">
            <option value="" disabled>-- Select a category --</option>
            {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="subcategory" className="block text-sm font-medium text-text-color mb-1">Subcategory</label>
          <select id="subcategory" name="subcategory" value={formData.subcategory} onChange={handleChange}
                  className="w-full px-4 py-2 bg-primary-bg border border-secondary-bg rounded-md focus:ring-2 focus:ring-accent outline-none transition">
            <option value="">-- Select a subcategory --</option>
            {subcategories.map(sub => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
          </select>
        </div>
      </div>
      
      {/* Weight and Dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input id="weight" name="weight" label="Weight (kg)" type="number" step="0.01" value={formData.weight} onChange={handleChange} placeholder="e.g., 1.5" />
        <div>
          <label className="block text-sm font-medium text-text-color mb-1">Dimensions (cm)</label>
          <div className="grid grid-cols-3 gap-2">
            <Input id="dimensions.length" name="dimensions.length" label="Length" type="number" step="0.1" value={formData.dimensions.length} onChange={handleChange} placeholder="L" />
            <Input id="dimensions.width" name="dimensions.width" label="Width" type="number" step="0.1" value={formData.dimensions.width} onChange={handleChange} placeholder="W" />
            <Input id="dimensions.height" name="dimensions.height" label="Height" type="number" step="0.1" value={formData.dimensions.height} onChange={handleChange} placeholder="H" />
          </div>
        </div>
      </div>

      {/* Tags Input */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-text-color mb-1">Tags</label>
        <Input id="tags" name="tags" label="Tags" value={formData.tags.join(', ')} onChange={handleTagsChange} placeholder="e.g., electronics, mobile, smartphone" />
        <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
      </div>

      {/* Featured Product Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isFeatured"
          name="isFeatured"
          checked={formData.isFeatured}
          onChange={handleChange}
          className="mr-2 h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
        />
        <label htmlFor="isFeatured" className="text-sm font-medium text-text-color">
          Mark as Featured Product
        </label>
      </div>

      {/* Availability Dropdown */}
      <div>
        <label htmlFor="availability" className="block text-sm font-medium text-text-color mb-1">Availability</label>
        <select id="availability" name="availability" value={formData.availability} onChange={handleChange}
                className="w-full px-4 py-2 bg-primary-bg border border-secondary-bg rounded-md focus:ring-2 focus:ring-accent outline-none transition">
          <option value="IN_STOCK">In Stock</option>
          <option value="MADE_TO_ORDER">Made to Order</option>
        </select>
      </div>
      
      {/* Submit Button */}
      <div className="pt-4 flex justify-end">
        <button type="submit" disabled={isSubmitting || isUploading} 
                className="bg-accent text-white font-semibold py-2 px-6 rounded-md hover:bg-accent-hover disabled:bg-accent/50 disabled:cursor-not-allowed transition">
          {isSubmitting ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
);
}