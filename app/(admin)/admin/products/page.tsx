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
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [discountData, setDiscountData] = useState({
    originalPrice: '',
    discountPercentage: '',
    discountStartDate: '',
    discountEndDate: ''
  });

  const fetchProducts = () => {
    api.getProducts()
      .then(data => {
        // Handle different response structures
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error('Unexpected API response:', data);
          setProducts([]);
          toast.error("Invalid response format from server.");
        }
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setProducts([]);
        toast.error("Could not fetch products.");
      })
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

  const handleOpenDiscountModal = (product: Product) => {
    setSelectedProduct(product);
    setDiscountData({
      originalPrice: product.originalPrice?.toString() || product.price.toString(),
      discountPercentage: product.discountPercentage?.toString() || '',
      discountStartDate: product.discountStartDate ? new Date(product.discountStartDate).toISOString().split('T')[0] : '',
      discountEndDate: product.discountEndDate ? new Date(product.discountEndDate).toISOString().split('T')[0] : ''
    });
    setDiscountModalOpen(true);
  };

  const handleCloseDiscountModal = () => {
    setSelectedProduct(null);
    setDiscountData({ originalPrice: '', discountPercentage: '', discountStartDate: '', discountEndDate: '' });
    setDiscountModalOpen(false);
  };

  const handleApplyDiscount = async () => {
    if (!selectedProduct || !token) return;

    try {
      setIsSubmitting(true);
      const originalPrice = parseFloat(discountData.originalPrice);
      const discountPercentage = parseFloat(discountData.discountPercentage);

      if (isNaN(originalPrice) || isNaN(discountPercentage)) {
        toast.error('Please enter valid numbers');
        return;
      }

      if (discountPercentage < 0 || discountPercentage > 100) {
        toast.error('Discount percentage must be between 0 and 100');
        return;
      }

      await api.adminApplyProductDiscount(token, selectedProduct._id, {
        originalPrice,
        discountPercentage,
        discountStartDate: discountData.discountStartDate || undefined,
        discountEndDate: discountData.discountEndDate || undefined
      });

      toast.success('Discount applied successfully');
      handleCloseDiscountModal();
      fetchProducts(); // Refresh the products list
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveDiscount = async (product: Product) => {
    if (!token) return;

    try {
      setIsSubmitting(true);
      await api.adminRemoveProductDiscount(token, product._id);
      toast.success('Discount removed successfully');
      fetchProducts(); // Refresh the products list
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (formData: any) => {
    if (!token) return;
    setIsSubmitting(true);

    // ✅ PAYLOAD TRANSFORMATION: Map frontend form data to backend API
    const payload = {
      title: formData.title,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      subcategory: formData.subcategory,
      sku: formData.sku,
      availability: formData.availability,
      images: formData.images,
      quantity: formData.quantity,
      weight: formData.weight,
      dimensions: formData.dimensions,
      tags: formData.tags || [],
      isFeatured: formData.isFeatured || false,
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
              <th className="p-4 font-semibold">SKU</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Subcategory</th>
              <th className="p-4 font-semibold">Price</th>
              <th className="p-4 font-semibold">Discount</th>
              <th className="p-4 font-semibold">Quantity</th>
              <th className="p-4 font-semibold">Featured</th>
              <th className="p-4 font-semibold">Availability</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(products) && products.length > 0 ? products.map(product => (
              <tr key={product._id} className="border-b border-secondary-bg last:border-b-0">
                <td className="p-2">
                  {/* ✅ Display the first image from the 'images' array */}
                  <Image 
                    src={product.images?.[0] || '/placeholder-product.jpg'} 
                    alt={product.title} 
                    width={50} 
                    height={60} 
                    className="rounded-md object-cover bg-secondary-bg"
                  />
                </td>
                <td className="p-4 font-medium text-heading-color max-w-xs">
                  <div className="truncate" title={product.title}>{product.title}</div>
                </td>
                <td className="p-4 text-sm text-gray-600">{product.sku || 'N/A'}</td>
                <td className="p-4 text-sm">{product.category?.name || 'N/A'}</td>
                <td className="p-4 text-sm">{product.subcategory?.name || 'N/A'}</td>
                <td className="p-4 font-semibold">
                  {product.originalPrice && product.originalPrice > product.price ? (
                    <div>
                      <div className="text-accent font-bold">₹{product.price.toFixed(2)}</div>
                      <div className="text-sm text-gray-500 line-through">₹{product.originalPrice.toFixed(2)}</div>
                    </div>
                  ) : (
                    `₹${product.price.toFixed(2)}`
                  )}
                </td>
                <td className="p-4">
                  {product.discountPercentage ? (
                    <div className="flex flex-col gap-1">
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                        {product.discountPercentage}% OFF
                      </span>
                      {product.discountEndDate && (
                        <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium">
                          Ends {new Date(product.discountEndDate).toLocaleDateString()}
                        </span>
                      )}
                      <button
                        onClick={() => handleRemoveDiscount(product)}
                        className="text-xs text-red-500 hover:underline"
                        disabled={isSubmitting}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenDiscountModal(product)}
                      className="text-xs text-accent hover:underline"
                    >
                      Add Discount
                    </button>
                  )}
                </td>
                <td className="p-4">{product.quantity}</td>
                <td className="p-4">
                  {product.isFeatured ? (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      Featured
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">No</span>
                  )}
                </td>
                <td className="p-4 capitalize">{product.availability.replace('_', ' ')}</td>
                <td className="p-4 space-x-4 whitespace-nowrap">
                  <button onClick={() => handleOpenModal(product)} className="text-accent hover:underline font-semibold">Edit</button>
                  <button onClick={() => handleDelete(product._id, product.title)} className="text-red-500 hover:underline font-semibold">Delete</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={11} className="p-8 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
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

      {/* Discount Modal */}
      <Modal
        isOpen={discountModalOpen}
        onClose={handleCloseDiscountModal}
        title={`Apply Discount - ${selectedProduct?.title}`}
      >
        <div className="space-y-4">
          <div>
            <Input
              id="original-price"
              label="Original Price (₹)"
              type="number"
              value={discountData.originalPrice}
              onChange={(e) => setDiscountData({ ...discountData, originalPrice: e.target.value })}
              placeholder="Enter original price"
              required
            />
          </div>
          <div>
            <Input
              id="discount-percentage"
              label="Discount Percentage (%)"
              type="number"
              value={discountData.discountPercentage}
              onChange={(e) => setDiscountData({ ...discountData, discountPercentage: e.target.value })}
              placeholder="Enter discount percentage (0-100)"
              min="0"
              max="100"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                id="discount-start-date"
                label="Discount Start Date (Optional)"
                type="date"
                value={discountData.discountStartDate}
                onChange={(e) => setDiscountData({ ...discountData, discountStartDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Input
                id="discount-end-date"
                label="Discount End Date (Optional)"
                type="date"
                value={discountData.discountEndDate}
                onChange={(e) => setDiscountData({ ...discountData, discountEndDate: e.target.value })}
                min={discountData.discountStartDate || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          {discountData.originalPrice && discountData.discountPercentage && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Price Preview:</h4>
              <div className="space-y-1">
                <div className="text-sm text-gray-600">
                  Original: ₹{parseFloat(discountData.originalPrice).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">
                  Discount: {parseFloat(discountData.discountPercentage)}%
                </div>
                <div className="text-lg font-bold text-accent">
                  Final Price: ₹{(parseFloat(discountData.originalPrice) * (1 - parseFloat(discountData.discountPercentage) / 100)).toFixed(2)}
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleApplyDiscount}
              disabled={isSubmitting || !discountData.originalPrice || !discountData.discountPercentage}
              className="flex-1"
            >
              {isSubmitting ? 'Applying...' : 'Apply Discount'}
            </Button>
            <Button
              onClick={handleCloseDiscountModal}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}