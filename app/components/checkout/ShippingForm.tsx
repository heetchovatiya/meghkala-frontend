// components/checkout/ShippingForm.tsx
"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/common/Input';

export function ShippingForm({ user, onFormChange }: { user: any, onFormChange: (data: any) => void }) {
  const [address, setAddress] = useState({
    street: '', city: '', postalCode: '', country: ''
  });

  // Pre-fill form if user has a saved address
  useEffect(() => {
    const savedAddress = user?.addresses?.[0];
    if (savedAddress) {
      const { street, city, postalCode, country } = savedAddress;
      setAddress({ street, city, postalCode, country });
    }
  }, [user]);

  // Notify parent component of changes
  useEffect(() => {
    onFormChange(address);
  }, [address, onFormChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h2 className="text-2xl font-serif text-heading-color mb-4">Shipping Address</h2>
      <div className="p-6 bg-secondary-bg/60 rounded-lg space-y-4">
        <Input id="street" name="street" label="Street Address" value={address.street} onChange={handleChange} required />
        <div className="grid grid-cols-2 gap-4">
          <Input id="city" name="city" label="City" value={address.city} onChange={handleChange} required />
          <Input id="postalCode" name="postalCode" label="Postal Code" value={address.postalCode} onChange={handleChange} required />
        </div>
        <Input id="country" name="country" label="Country" value={address.country} onChange={handleChange} required />
      </div>
    </div>
  );
}