// app/(admin)/admin/discounts/page.tsx
"use client";

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import * as api from '@/lib/api';
import toast from 'react-hot-toast';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/ui/Modal';
import { Plus, Edit, Trash2, Calendar, Target } from 'lucide-react';

interface Discount {
  _id: string;
  name: string;
  description: string;
  discountType: 'Percentage' | 'Fixed';
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Inactive' | 'Expired';
  applicableCategories?: { _id: string; name: string }[];
  applicableProducts?: { _id: string; title: string }[];
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  title: string;
}

export default function AdminDiscountsPage() {
  const { token } = useAuth();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discountType: 'Percentage' as 'Percentage' | 'Fixed',
    value: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    startDate: '',
    endDate: '',
    applicableCategories: [] as string[],
    applicableProducts: [] as string[],
    usageLimit: '',
    isActive: true,
  });

  const fetchDiscounts = () => {
    if (token) {
      setLoading(true);
      api.adminGetAllDiscounts(token)
        .then(data => setDiscounts(data))
        .catch(() => toast.error("Failed to fetch discounts."))
        .finally(() => setLoading(false));
    }
  };

  const fetchCategories = () => {
    api.getCategories(true)
      .then(data => setCategories(data))
      .catch(() => toast.error("Failed to fetch categories."));
  };

  const fetchProducts = () => {
    api.getProducts({ limit: 1000 })
      .then(data => setProducts(Array.isArray(data) ? data : data.products || []))
      .catch(() => toast.error("Failed to fetch products."));
  };

  useEffect(() => {
    fetchDiscounts();
    fetchCategories();
    fetchProducts();
  }, [token]);

  const handleOpenModal = (discount: Discount | null = null) => {
    setEditingDiscount(discount);
    if (discount) {
      setFormData({
        name: discount.name,
        description: discount.description,
        discountType: discount.discountType,
        value: String(discount.value),
        minOrderAmount: String(discount.minOrderAmount || ''),
        maxDiscountAmount: String(discount.maxDiscountAmount || ''),
        startDate: new Date(discount.startDate).toISOString().split('T')[0],
        endDate: new Date(discount.endDate).toISOString().split('T')[0],
        applicableCategories: discount.applicableCategories?.map(cat => cat?._id).filter(Boolean) || [],
        applicableProducts: discount.applicableProducts?.map(prod => prod?._id).filter(Boolean) || [],
        usageLimit: String(discount.usageLimit || ''),
        isActive: discount.isActive,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        discountType: 'Percentage',
        value: '',
        minOrderAmount: '',
        maxDiscountAmount: '',
        startDate: '',
        endDate: '',
        applicableCategories: [],
        applicableProducts: [],
        usageLimit: '',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingDiscount(null);
    setIsModalOpen(false);
    setFormData({
      name: '',
      description: '',
      discountType: 'Percentage',
      value: '',
      minOrderAmount: '',
      maxDiscountAmount: '',
      startDate: '',
      endDate: '',
      applicableCategories: [],
      applicableProducts: [],
      usageLimit: '',
      isActive: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        discountType: formData.discountType,
        value: parseFloat(formData.value),
        minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : undefined,
        maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : undefined,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        applicableCategories: formData.applicableCategories.length > 0 ? formData.applicableCategories : undefined,
        applicableProducts: formData.applicableProducts.length > 0 ? formData.applicableProducts : undefined,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
        isActive: formData.isActive,
      };

      if (editingDiscount) {
        await api.adminUpdateDiscount(token, editingDiscount._id, payload);
        toast.success(`Discount "${payload.name}" updated successfully!`);
      } else {
        await api.adminCreateDiscount(token, payload);
        toast.success(`Discount "${payload.name}" created successfully!`);
      }
      
      fetchDiscounts();
      handleCloseModal();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (discountId: string, discountName: string) => {
    if (!token || !window.confirm(`Are you sure you want to delete discount "${discountName}"?`)) return;
    
    try {
      await api.adminDeleteDiscount(token, discountId);
      toast.success(`Discount "${discountName}" deleted.`);
      fetchDiscounts();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const isUpcoming = (startDate: string) => {
    return new Date(startDate) > new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif text-heading-color">Manage Discounts</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-hover transition-colors"
        >
          <Plus size={16} />
          Add New Discount
        </button>
      </div>

      {/* Discounts Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {discounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No discounts found
                  </td>
                </tr>
              ) : (
                discounts.map(discount => (
                  <tr key={discount._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{discount.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{discount.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {discount.discountType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {discount.discountType === 'Percentage' 
                        ? `${discount.value}%` 
                        : `₹${discount.value}`
                      }
                      {discount.minOrderAmount && (
                        <div className="text-xs text-gray-500">
                          Min: ₹{discount.minOrderAmount}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        <div>
                          <div>{new Date(discount.startDate).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">to {new Date(discount.endDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {discount.usageLimit ? (
                        <div>
                          <div>{discount.usedCount} / {discount.usageLimit}</div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-accent h-2 rounded-full" 
                              style={{ width: `${(discount.usedCount / discount.usageLimit) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <div>{discount.usedCount} uses</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isExpired(discount.endDate) ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Expired
                        </span>
                      ) : isUpcoming(discount.startDate) ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          Upcoming
                        </span>
                      ) : (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(discount.status)}`}>
                          {discount.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleOpenModal(discount)}
                        className="text-accent hover:text-accent/80 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(discount._id, discount.name)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Discount Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingDiscount ? 'Edit Discount' : 'Add New Discount'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="name"
              label="Discount Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Summer Sale"
              required
            />
            <div>
              <label htmlFor="discountType" className="block text-sm font-medium text-text-color mb-1">
                Discount Type
              </label>
              <select
                id="discountType"
                value={formData.discountType}
                onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value as 'Percentage' | 'Fixed' }))}
                className="w-full px-4 py-2 bg-primary-bg border border-secondary-bg rounded-md focus:ring-2 focus:ring-accent outline-none transition"
                required
              >
                <option value="Percentage">Percentage</option>
                <option value="Fixed">Fixed Amount</option>
              </select>
            </div>
          </div>

          <Input
            id="description"
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Brief description of the discount"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              id="value"
              label={formData.discountType === 'Percentage' ? 'Percentage (%)' : 'Amount (₹)'}
              type="number"
              step={formData.discountType === 'Percentage' ? '1' : '0.01'}
              min="0"
              max={formData.discountType === 'Percentage' ? '100' : undefined}
              value={formData.value}
              onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
              placeholder={formData.discountType === 'Percentage' ? '20' : '100'}
              required
            />
            <Input
              id="minOrderAmount"
              label="Min Order Amount (₹)"
              type="number"
              step="0.01"
              min="0"
              value={formData.minOrderAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, minOrderAmount: e.target.value }))}
              placeholder="0"
            />
            <Input
              id="maxDiscountAmount"
              label="Max Discount (₹)"
              type="number"
              step="0.01"
              min="0"
              value={formData.maxDiscountAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, maxDiscountAmount: e.target.value }))}
              placeholder="No limit"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="startDate"
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              required
            />
            <Input
              id="endDate"
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              min={formData.startDate}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-color mb-2">Applicable Categories</label>
              <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                {categories.map(category => (
                  <label key={category._id} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.applicableCategories.includes(category._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            applicableCategories: [...prev.applicableCategories, category._id]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            applicableCategories: prev.applicableCategories.filter(id => id !== category._id)
                          }));
                        }
                      }}
                      className="rounded"
                    />
                    <span>{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-color mb-2">Applicable Products</label>
              <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                {products.slice(0, 20).map(product => (
                  <label key={product._id} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.applicableProducts.includes(product._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            applicableProducts: [...prev.applicableProducts, product._id]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            applicableProducts: prev.applicableProducts.filter(id => id !== product._id)
                          }));
                        }
                      }}
                      className="rounded"
                    />
                    <span className="truncate">{product.title}</span>
                  </label>
                ))}
                {products.length > 20 && (
                  <div className="text-xs text-gray-500 mt-1">
                    Showing first 20 products
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="usageLimit"
              label="Usage Limit"
              type="number"
              min="1"
              value={formData.usageLimit}
              onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: e.target.value }))}
              placeholder="No limit"
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-text-color">
                Active
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover disabled:bg-accent/50 transition-colors"
            >
              {isSubmitting ? 'Saving...' : editingDiscount ? 'Update Discount' : 'Create Discount'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}