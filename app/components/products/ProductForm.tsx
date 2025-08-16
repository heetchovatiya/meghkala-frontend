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
}

interface ProductFormProps {
  initialData?: Product | null;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export function ProductForm({ initialData, onSubmit, isSubmitting }: ProductFormProps) {
  const { token } = useAuth();
  const [categories, setCategories] = useState<{_id: string, name: string}[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // ✅ FORM STATE ALIGNED WITH THE NEW SCHEMA
  const [formData, setFormData] = useState({
    title: '', // Kept as 'name'
    price: '',
    quantity: '', // Added 'quantity'
    description: '',
    images: [] as string[], // Changed to 'images' array
    availability: 'IN_STOCK',
    category: '',
  });

   useEffect(() => {
    api.getCategories().then(setCategories).catch(() => toast.error("Could not load categories."));
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title, // Use 'name'
        price: String(initialData.price),
        quantity: String(initialData.quantity), // Add 'quantity'
        description: initialData.description || '',
        images: initialData.images || [], // Use 'images' array
        availability: initialData.availability || 'IN_STOCK',
        category: initialData.category?._id || '',
      });
    } else {
      setFormData({
        title: '', price: '', quantity: '', description: '', images: [], availability: 'IN_STOCK', category: '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // ... (this function remains the same, but it now adds to the 'images' array)
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setIsUploading(true);
    const toastId = toast.loading('Uploading image...');
    try {
      const result = await api.uploadImage(token, file);
      setFormData(prev => ({ ...prev, images: [...prev.images, result.imageUrl] }));
      toast.success('Image uploaded!', { id: toastId });
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`, { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) return toast.error("Please select a category.");
    if (formData.images.length === 0) return toast.error("Please upload at least one image.");
    
    onSubmit({ 
        ...formData, 
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Name Input (changed from 'title' back to 'name') */}
      <Input id="name" name="name" label="Product Name" value={formData.title} onChange={handleChange} required />
      
      {/* Grid for Price and new Quantity Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input id="price" name="price" label="Price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
        <Input id="quantity" name="quantity" label="Stock Quantity" type="number" value={formData.quantity} onChange={handleChange} required placeholder="e.g., 10" />
      </div>
      
      {/* Description Textarea */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-text-color mb-1">Description</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4}
                  className="w-full px-4 py-2 bg-primary-bg border border-secondary-bg rounded-md focus:ring-2 focus:ring-accent outline-none transition" />
      </div>
      
      {/* --- MODIFIED IMAGE UPLOAD UI --- */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-text-color">Product Images</label>
        {/* Container for image previews */}
        <div className="flex flex-wrap gap-3 p-2 bg-secondary-bg/50 rounded-md min-h-[6rem]">
            {formData.images.length > 0 ? (
                formData.images.map((imgUrl, index) => (
                    <img key={index} src={imgUrl} alt={`Product preview ${index + 1}`} className="w-20 h-20 object-cover rounded-md bg-secondary-bg shadow-sm"/>
                ))
            ) : (
                <p className="text-sm text-text-color p-4">No images uploaded yet.</p>
            )}
        </div>
        {/* The upload button/label */}
        <label htmlFor="imageUpload" 
               className={`relative flex justify-center items-center gap-2 cursor-pointer bg-primary-bg rounded-md font-medium text-accent hover:text-accent-hover focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-accent p-3 border border-dashed border-secondary-bg text-center w-full ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <UploadCloud className="h-5 w-5" />
          <span>{isUploading ? 'Uploading...' : 'Add Image'}</span>
          <input id="imageUpload" name="imageUpload" type="file" className="sr-only" onChange={handleImageUpload} disabled={isUploading} accept="image/*" />
        </label>
      </div>
      
      {/* Category Dropdown */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-text-color mb-1">Category</label>
        <select id="category" name="category" value={formData.category} onChange={handleChange} required
                className="w-full px-4 py-2 bg-primary-bg border border-secondary-bg rounded-md focus:ring-2 focus:ring-accent outline-none transition">
          <option value="" disabled>-- Select a category --</option>
          {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
        </select>
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