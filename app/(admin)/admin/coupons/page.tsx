// app/(admin)/admin/coupons/page.tsx
"use client";

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import * as api from '@/lib/api';
import toast from 'react-hot-toast';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/ui/Modal';
import { Plus, Edit, Trash2, Copy, CheckCircle } from 'lucide-react';

interface Coupon {
  _id: string;
  code: string;
  discountType: 'Percentage' | 'Fixed';
  value: number;
  expiryDate: string;
  usedBy: string[];
  createdAt: string;
}

export default function AdminCouponsPage() {
  const { token } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'Percentage' as 'Percentage' | 'Fixed',
    value: '',
    expiryDate: '',
  });

  const fetchCoupons = () => {
    if (token) {
      setLoading(true);
      api.adminGetAllCoupons(token)
        .then(data => setCoupons(data))
        .catch(() => toast.error("Failed to fetch coupons."))
        .finally(() => setLoading(false));
    }
  };

  useEffect(fetchCoupons, [token]);

  const handleOpenModal = (coupon: Coupon | null = null) => {
    setEditingCoupon(coupon);
    if (coupon) {
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType,
        value: String(coupon.value),
        expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0],
      });
    } else {
      setFormData({
        code: '',
        discountType: 'Percentage',
        value: '',
        expiryDate: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingCoupon(null);
    setIsModalOpen(false);
    setFormData({
      code: '',
      discountType: 'Percentage',
      value: '',
      expiryDate: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsSubmitting(true);
    try {
      const payload = {
        code: formData.code.toUpperCase().trim(),
        discountType: formData.discountType,
        value: parseFloat(formData.value),
        expiryDate: new Date(formData.expiryDate),
      };

      if (editingCoupon) {
        await api.adminUpdateCoupon(token, editingCoupon._id, payload);
        toast.success(`Coupon "${payload.code}" updated successfully!`);
      } else {
        await api.adminCreateCoupon(token, payload);
        toast.success(`Coupon "${payload.code}" created successfully!`);
      }
      
      fetchCoupons();
      handleCloseModal();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (couponId: string, couponCode: string) => {
    if (!token || !window.confirm(`Are you sure you want to delete coupon "${couponCode}"?`)) return;
    
    try {
      await api.adminDeleteCoupon(token, couponId);
      toast.success(`Coupon "${couponCode}" deleted.`);
      fetchCoupons();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success('Coupon code copied!');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
        <h1 className="text-3xl font-serif text-heading-color">Manage Coupons</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-hover transition-colors"
        >
          <Plus size={16} />
          Add New Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No coupons found
                  </td>
                </tr>
              ) : (
                coupons.map(coupon => (
                  <tr key={coupon._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium text-gray-900">
                          {coupon.code}
                        </span>
                        <button
                          onClick={() => copyToClipboard(coupon.code)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {copiedCode === coupon.code ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {coupon.discountType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {coupon.discountType === 'Percentage' 
                        ? `${coupon.value}%` 
                        : `₹${coupon.value}`
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {coupon.usedBy.length} uses
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isExpired(coupon.expiryDate) ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Expired
                        </span>
                      ) : getDaysUntilExpiry(coupon.expiryDate) <= 7 ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Expires Soon
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleOpenModal(coupon)}
                        className="text-accent hover:text-accent/80 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon._id, coupon.code)}
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

      {/* Coupon Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="code"
            label="Coupon Code"
            value={formData.code}
            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
            placeholder="e.g., SAVE20"
            required
          />

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <Input
            id="expiryDate"
            label="Expiry Date"
            type="date"
            value={formData.expiryDate}
            onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
            min={new Date().toISOString().split('T')[0]}
            required
          />

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
              {isSubmitting ? 'Saving...' : editingCoupon ? 'Update Coupon' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}