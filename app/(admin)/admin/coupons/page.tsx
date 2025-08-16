// app/(admin)/admin/coupons/page.tsx
"use client";

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import * as api from '@/lib/api';
import { Input } from '@/components/common/Input';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker'; // Import DatePicker


// Define the shape of a Coupon for TypeScript
interface Coupon {
  _id: string;
  code: string;
  discountType: 'Percentage' | 'Fixed';
  value: number;
}

export default function AdminCouponsPage() {
  const { token } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for the new coupon form
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'Fixed', // Assuming backend wants lowercase
    value: '',
    expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Default to 30 days from now
  });
  
  const fetchCoupons = () => {
    if (!token) return;
    api.adminGetAllCoupons(token)
      .then(data => setCoupons(data))
      .catch(() => toast.error("Failed to load coupons."))
      .finally(() => setIsLoading(false));
  };

  // Fetch coupons on initial load
  useEffect(fetchCoupons, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Convert coupon code to uppercase for consistency
    const processedValue = name === 'code' ? value.toUpperCase() : value;
    setNewCoupon(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    // ✅ MODIFIED: Create a payload with the correct field names and types
    const payload = {
      code: newCoupon.code,
      discountType: newCoupon.discountType,
      value: parseFloat(newCoupon.value), // The field is 'value'
      expiryDate: newCoupon.expiryDate.toISOString(), // Send as ISO string
    };

    const toastId = toast.loading("Creating coupon...");
    try {
      await api.adminCreateCoupon(token, payload);
      toast.success(`Coupon "${newCoupon.code}" created!`, { id: toastId });
      // Reset form
      setNewCoupon({
        code: '',
        discountType: 'Fixed',
        value: '',
        expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      });
      fetchCoupons();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, { id: toastId });
    }
  };
  
  const handleDeleteCoupon = async (couponId: string, couponCode: string) => {
    if (!token || !window.confirm(`Are you sure you want to delete the coupon "${couponCode}"?`)) return;
    
    const toastId = toast.loading(`Deleting ${couponCode}...`);
    try {
      // ✅ This calls the correct function in your API library
      await api.adminDeleteCoupon(token, couponId);
      toast.success(`Coupon "${couponCode}" deleted.`, { id: toastId });
      fetchCoupons(); // Refresh the list on success
    } catch (error: any) {
      // ✅ This will now catch the "Coupon not found" error from the backend
      toast.error(`Error: ${error.message}`, { id: toastId });
    }
};


  if (isLoading) return <div>Loading coupons...</div>;

  return (
    <div>
      <h1 className="text-3xl font-serif text-heading-color mb-8">Manage Coupons</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {/* Add Coupon Form */}
        <div className="md:col-span-1">
          <form onSubmit={handleAddCoupon} className="bg-primary-bg p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl ...">Add New Coupon</h2>
            <Input id="code" name="code" label="Coupon Code" value={newCoupon.code} onChange={handleInputChange} required />
            <div>
              <label htmlFor="discountType">Discount Type</label>
              <select id="discountType" name="discountType" value={newCoupon.discountType} onChange={handleInputChange} className="w-full ...">
                {/* ✅ MODIFIED: Values are now lowercase */}
                <option value="Fixed">Fixed Amount (₹)</option>
                <option value="Percentage">Percentage (%)</option>
              </select>
            </div>
            {/* ✅ MODIFIED: Input name is now 'value' */}
            <Input id="value" name="value" label="Value" type="number" step="0.01" value={newCoupon.value} onChange={handleInputChange} required />
            
            {/* ✅ NEW: Expiry Date Picker */}
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-text-color mb-1">Expiry Date</label>
             <DatePicker
                selected={newCoupon.expiryDate}
                // Update the handler to accept `Date | null`
                onChange={(date: Date | null) => {
                  // If a date is selected, update the state.
                  // If the date is cleared (null), you could set a default or handle it as an error.
                  // For simplicity, we'll only update if it's a valid date.
                  if (date) {
                    setNewCoupon(prev => ({ ...prev, expiryDate: date }));
                  }
                }}
                dateFormat="MMMM d, yyyy"
                className="w-full px-4 py-2 bg-primary-bg border border-secondary-bg rounded-md focus:ring-2 focus:ring-accent outline-none"
                minDate={new Date()}
              />
            </div>

            <button type="submit" className="w-full mt-4 ...">Add Coupon</button>
          </form>
        </div>

        {/* Existing Coupons List */}
        <div className="md:col-span-2 bg-primary-bg p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-heading-color mb-4">Existing Coupons</h2>
          <div className="space-y-2">
            {coupons.length > 0 ? coupons.map(c => (
              <div key={c._id} className="flex justify-between items-center p-3 bg-secondary-bg/50 rounded-md">
                <div>
                  <p className="font-semibold text-heading-color font-mono">{c.code}</p>
                  <p className="text-sm text-text-color">
                    {/* 1. Use 'c.value' instead of 'c.discountValue' to match the backend model. */}
                    {/* 2. Add a defensive check to ensure 'c.value' is a number before calling toFixed. */}
                    {c.discountType === 'Fixed'
                      ? `₹${typeof c.value === 'number' ? c.value.toFixed(2) : '0.00'}`
                      : `${typeof c.value === 'number' ? c.value : '0'}%`
                    } off
                  </p>
                </div>
                <button onClick={() => handleDeleteCoupon(c._id, c.code)} className="text-red-500 hover:underline text-sm font-semibold">
                  Delete
                </button>
              </div>
            )) : <p className="text-text-color text-center py-4">No coupons created yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}