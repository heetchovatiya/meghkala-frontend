// components/checkout/ShippingForm.tsx
"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/common/Input';
import { useAuth } from '@/hooks/useAuth';
import * as api from '@/lib/api';
import toast from 'react-hot-toast';
import { MapPin, Plus, Edit, Trash2 } from 'lucide-react';

export function ShippingForm({ user, onFormChange }: { user: any, onFormChange: (data: any) => void }) {
<<<<<<< HEAD
  const { token } = useAuth();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [address, setAddress] = useState({
    street: '', city: '', postalCode: '', country: '', contactNumber: ''
  });

  // Load user's saved addresses
  useEffect(() => {
    const loadAddresses = async () => {
      if (!token) return;
      
      try {
        const response = await api.getUserAddresses(token);
        setAddresses(response.addresses || []);
        
        // If user has addresses, select the first one by default
        if (response.addresses && response.addresses.length > 0) {
          setSelectedAddressId(response.addresses[0]._id);
          const firstAddress = response.addresses[0];
          setAddress({
            street: firstAddress.line1 || '',
            city: firstAddress.city || '',
            postalCode: firstAddress.postalCode || '',
            country: firstAddress.country || '',
            contactNumber: firstAddress.contactNumber || ''
          });
        } else {
          // No saved addresses, show new address form
          setShowNewAddressForm(true);
        }
      } catch (error) {
        console.error('Error loading addresses:', error);
        // If no addresses or error, show new address form
        setShowNewAddressForm(true);
      }
    };

    loadAddresses();
  }, [token]);

  // Handle address selection
  const handleAddressSelect = (addressId: string) => {
    const selectedAddress = addresses.find(addr => addr._id === addressId);
    if (selectedAddress) {
      setSelectedAddressId(addressId);
      setAddress({
        street: selectedAddress.line1 || '',
        city: selectedAddress.city || '',
        postalCode: selectedAddress.postalCode || '',
        country: selectedAddress.country || '',
        contactNumber: selectedAddress.contactNumber || ''
      });
      setShowNewAddressForm(false);
    }
  };

  // Handle saving new address
  const handleSaveAddress = async () => {
    if (!token) return;
    
    const { street, city, postalCode, country, contactNumber } = address;
    if (!street || !city || !postalCode || !country || !contactNumber) {
      toast.error('Please fill in all address fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.addUserAddress(token, {
        line1: street,
        city,
        postalCode,
        country,
        contactNumber
      });
      
      setAddresses(response.addresses);
      setSelectedAddressId(response.address._id);
      setShowNewAddressForm(false);
      toast.success('Address saved successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save address');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting address
  const handleDeleteAddress = async (addressId: string) => {
    if (!token) return;
    
    try {
      const response = await api.deleteUserAddress(token, addressId);
      setAddresses(response.addresses);
      
      // If we deleted the selected address, select another one or show new form
      if (selectedAddressId === addressId) {
        if (response.addresses.length > 0) {
          handleAddressSelect(response.addresses[0]._id);
        } else {
          setSelectedAddressId(null);
          setShowNewAddressForm(true);
          setAddress({ street: '', city: '', postalCode: '', country: '', contactNumber: '' });
        }
      }
      
      toast.success('Address deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete address');
    }
  };
=======
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
>>>>>>> a3483edccba147da04df8727df923cd6a9f35628

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

<<<<<<< HEAD
  return (
    <div>
      <h2 className="text-2xl font-serif text-heading-color mb-4">Shipping Address</h2>
      
      {/* Saved Addresses */}
      {addresses.length > 0 && !showNewAddressForm && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-heading-color mb-3">Select Address</h3>
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div
                key={addr._id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedAddressId === addr._id
                    ? 'border-accent bg-accent/5'
                    : 'border-secondary-bg hover:border-accent/50'
                }`}
                onClick={() => handleAddressSelect(addr._id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <MapPin size={20} className="text-accent mt-1" />
                    <div>
                      <p className="font-medium text-heading-color">{addr.line1}</p>
                      <p className="text-text-color">{addr.city}, {addr.postalCode}</p>
                      <p className="text-text-color">{addr.country}</p>
                      <p className="text-text-color">{addr.contactNumber}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAddress(addr._id);
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={() => setShowNewAddressForm(true)}
            className="mt-4 flex items-center gap-2 text-accent hover:text-accent-hover font-medium"
          >
            <Plus size={16} />
            Add New Address
          </button>
        </div>
      )}

      {/* New Address Form */}
      {showNewAddressForm && (
        <div className="p-6 bg-secondary-bg/60 rounded-lg space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-heading-color">
              {addresses.length > 0 ? 'Add New Address' : 'Shipping Address'}
            </h3>
            {addresses.length > 0 && (
              <button
                onClick={() => setShowNewAddressForm(false)}
                className="text-text-color hover:text-heading-color"
              >
                Cancel
              </button>
            )}
          </div>
          
          <Input 
            id="contactNumber" 
            name="contactNumber" 
            label="Contact Number" 
            type="tel" 
            value={address.contactNumber} 
            onChange={handleChange} 
            required 
          />
          <Input 
            id="street" 
            name="street" 
            label="Street Address" 
            value={address.street} 
            onChange={handleChange} 
            required 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              id="city" 
              name="city" 
              label="City" 
              value={address.city} 
              onChange={handleChange} 
              required 
            />
            <Input 
              id="postalCode" 
              name="postalCode" 
              label="Postal Code" 
              value={address.postalCode} 
              onChange={handleChange} 
              required 
            />
          </div>
          <Input 
            id="country" 
            name="country" 
            label="Country" 
            value={address.country} 
            onChange={handleChange} 
            required 
          />
          
          <button
            onClick={handleSaveAddress}
            disabled={isLoading}
            className="w-full bg-accent text-white font-semibold rounded-md py-3 px-4 transition-all duration-300 ease-in-out hover:bg-accent-hover disabled:bg-accent/50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Address'}
          </button>
        </div>
      )}
    </div>
  );
=======
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
>>>>>>> a3483edccba147da04df8727df923cd6a9f35628
}