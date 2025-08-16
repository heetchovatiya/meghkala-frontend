// app/(admin)/admin/products/page.tsx
"use client";

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import * as api from '@/lib/api';
import toast from 'react-hot-toast'; // Import toast for feedback
import Image from 'next/image';
import { Modal } from '@/components/ui/Modal';
import { ProductForm } from '@/components/products/ProductForm';
import { Product } from '@/components/products/ProductCard';

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = () => {
    api.getProducts()
      .then(data => setProducts(data))
      .catch(() => toast.error("Could not fetch products."))
      .finally(() => setLoading(false));
  };

  useEffect(fetchProducts, []);

  const handleOpenModal = (product: Product | null = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (formData: any) => {
    if (!token) return;
    setIsSubmitting(true);

    // ✅ PAYLOAD TRANSFORMATION: Map frontend `name` to backend `title`.
    // The rest of the fields (images, quantity) now align perfectly.
    const payload = {
      title: formData.name, // The only mapping we need now
      description: formData.description,
      price: formData.price,
      category: formData.category,
      availability: formData.availability,
      images: formData.images,
      quantity: formData.quantity,
    };

    try {
      if (editingProduct) {
        await api.adminUpdateProduct(token, editingProduct._id, payload);
        toast.success(`Product "${payload.title}" updated successfully!`);
      } else {
        await api.adminCreateProduct(token, payload);
        toast.success(`Product "${payload.title}" created successfully!`);
      }
      fetchProducts(); // Refresh the product list
      handleCloseModal();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async (productId: string, productName: string) => {
    if (!token || !window.confirm(`Are you sure you want to delete "${productName}"?`)) return;
    
    try {
      await api.adminDeleteProduct(token, productId);
      toast.success(`Product "${productName}" deleted.`);
      fetchProducts(); // Refresh the product list
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-heading-color">Manage Products</h1>
        <button onClick={() => handleOpenModal()} className="bg-accent text-white font-semibold py-2 px-4 rounded-md hover:bg-accent-hover transition">
          + Add New Product
        </button>
      </div>
      
      <div className="bg-primary-bg rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-secondary-bg/60">
            <tr>
              {/* ✅ UPDATED TABLE HEADERS */}
              <th className="p-4 font-semibold">Image</th>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Price</th>
              <th className="p-4 font-semibold">Quantity</th>
              <th className="p-4 font-semibold">Availability</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id} className="border-b border-secondary-bg last:border-b-0">
                <td className="p-2">
                  {/* ✅ Display the first image from the 'images' array */}
                  <Image 
                    src={product.images?.[0] || '/placeholder-product.jpg'} 
                    alt={product.name} 
                    width={50} 
                    height={60} 
                    className="rounded-md object-cover bg-secondary-bg"
                  />
                </td>
                <td className="p-4 font-medium text-heading-color">{product.name}</td>
                <td className="p-4">${product.price.toFixed(2)}</td>
                <td className="p-4">{product.quantity}</td>
                <td className="p-4 capitalize">{product.availability.replace('_', ' ')}</td>
                <td className="p-4 space-x-4 whitespace-nowrap">
                  <button onClick={() => handleOpenModal(product)} className="text-accent hover:underline font-semibold">Edit</button>
                  <button onClick={() => handleDelete(product._id, product.name)} className="text-red-500 hover:underline font-semibold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <ProductForm
          initialData={editingProduct}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
}