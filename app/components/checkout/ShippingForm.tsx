// components/checkout/ShippingForm.tsx
"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/common/Input';

export function ShippingForm({ user, onFormChange }: { user: any, onFormChange: (data: any) => void }) {
  const [address, setAddress] = useState({
    street: '', city: '', postalCode: '', country: '', contactNumber: ''
  });
  const [errors, setErrors] = useState({
    street: '', city: '', postalCode: '', country: '', contactNumber: ''
  });

  // Pre-fill form if user has a saved address
  useEffect(() => {
    const savedAddress = user?.addresses?.[0];
    if (savedAddress) {
      const { street, city, postalCode, country , contactNumber} = savedAddress;
      setAddress({ street, city, postalCode, country , contactNumber});
    }
  }, [user]);

  // Notify parent component of changes
  useEffect(() => {
    onFormChange(address);
  }, [address, onFormChange]);

  const validateInput = (name, value) => {
    let error = '';
    switch (name) {
      case 'contactNumber':
        if (value.length !== 10) {
          error = 'Contact number must be exactly 10 digits.';
        }
        break;
      case 'city':
        // No specific length validation here, but we will prevent numbers
        break;
      case 'postalCode':
        if (value.length !== 6) {
          error = 'Postal code must be exactly 6 digits.';
        }
        break;
      case 'country':
        // No specific length validation here, but we will prevent numbers
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    // ✅ MODIFIED: Real-time input filtering
    switch (name) {
      case 'contactNumber':
        // Only allow digits and limit to 10
        newValue = value.replace(/\D/g, '').slice(0, 10);
        break;
      case 'city':
        // Only allow letters and spaces
        newValue = value.replace(/[^a-zA-Z\s]/g, '');
        break;
      case 'postalCode':
        // Only allow digits and limit to 6
        newValue = value.replace(/\D/g, '').slice(0, 6);
        break;
      case 'country':
        // Only allow letters and spaces
        newValue = value.replace(/[^a-zA-Z\s]/g, '');
        break;
      default:
        break;
    }

    setAddress(prev => ({ ...prev, [name]: newValue }));
    validateInput(name, newValue);
  };

  return (
    <div>
      <h2 className="text-2xl font-serif text-heading-color mb-4">Shipping Address</h2>
      <div className="p-6 bg-secondary-bg/60 rounded-lg space-y-4">
        <Input 
          id="contactNumber" 
          name="contactNumber" 
          label="Contact Number" 
          type="tel" 
          value={address.contactNumber} 
          onChange={handleChange} 
          required 
          error={errors.contactNumber} 
          maxLength={10}
        />
        <Input 
          id="street" 
          name="street" 
          label="Street Address" 
          value={address.street} 
          onChange={handleChange} 
          required 
          error={errors.street}
        />
        <div className=" ">
          <Input 
            id="city" 
            name="city" 
            label="City" 
            value={address.city} 
            onChange={handleChange} 
            required 
            error={errors.city} 
          />
          <Input 
            id="postalCode" 
            name="postalCode" 
            label="Postal Code" 
            value={address.postalCode} 
            onChange={handleChange} 
            required 
            error={errors.postalCode} 
            maxLength={6}
          />
        </div>
        <Input 
          id="country" 
          name="country" 
          label="Country" 
          value={address.country} 
          onChange={handleChange} 
          required 
          error={errors.country} 
        />
      </div>
    </div>
  );
}