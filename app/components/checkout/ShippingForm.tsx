// app/components/checkout/ShippingForm.tsx
"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/common/Input';
import { useAuth } from '@/hooks/useAuth';
import * as api from '@/lib/api';
import toast from 'react-hot-toast';
import { MapPin, Plus, Trash2 } from 'lucide-react';

// Define a type for the address state for better type safety
type AddressState = {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  contactNumber: string;
};

// Define a type for the component's props
interface ShippingFormProps {
  user: any; // Consider creating a more specific user type
  onFormChange: (data: AddressState, isValid: boolean) => void;
}

export function ShippingForm({ user, onFormChange }: ShippingFormProps) {
  const { token } = useAuth();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [address, setAddress] = useState<AddressState>({
    street: '', city: '', postalCode: '', country: '', contactNumber: ''
  });

  // FIX 1: Declare the 'errors' state to store validation messages
  const [errors, setErrors] = useState<Partial<Record<keyof AddressState, string>>>({});

  // Load user's saved addresses
  useEffect(() => {
    const loadAddresses = async () => {
      if (!token) return;
      
      try {
        const response = await api.getUserAddresses(token);
        setAddresses(response.addresses || []);
        
        if (response.addresses && response.addresses.length > 0) {
          // Select the first address by default
          handleAddressSelect(response.addresses[0]._id);
        } else {
          setShowNewAddressForm(true);
        }
      } catch (error) {
        console.error('Error loading addresses:', error);
        setShowNewAddressForm(true);
      }
    };

    loadAddresses();
  }, [token]);

  // Handle address selection from the saved list
  const handleAddressSelect = (addressId: string) => {
    const selected = addresses.find(addr => addr._id === addressId);
    if (selected) {
      setSelectedAddressId(addressId);
      setAddress({
        street: selected.line1 || '',
        city: selected.city || '',
        postalCode: selected.postalCode || '',
        country: selected.country || '',
        contactNumber: selected.contactNumber || ''
      });
      setShowNewAddressForm(false);
    }
  };

  const validateInput = (name: keyof AddressState, value: string) => {
    let error = '';
    switch (name) {
      case 'contactNumber':
        if (value.length > 0 && value.length !== 10) {
          error = 'Must be 10 digits.';
        }
        break;
      case 'postalCode':
        if (value.length > 0 && value.length !== 6) {
          error = 'Must be 6 digits.';
        }
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };
  
  // FIX 2: Create the missing handleChange function
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: keyof AddressState; value: string };
    let processedValue = value;

    // Filter input to only allow numbers for specific fields
    if (name === 'contactNumber' || name === 'postalCode') {
      processedValue = value.replace(/[^0-9]/g, '');
    }
    
    setAddress(prev => ({ ...prev, [name]: processedValue }));
    validateInput(name, processedValue);
  };

  // Notify parent component of changes
  useEffect(() => {
    const formValues = Object.values(address);
    const hasEmptyFields = formValues.some(val => val.trim() === '');
    const hasErrors = Object.values(errors).some(err => err);
    const isValid = !hasEmptyFields && !hasErrors;
    // FIX 3: Remove `onFormChange` from dependency array to prevent re-renders
    onFormChange(address, isValid);
  }, [address, errors]);


  // Handle saving a new address
  const handleSaveAddress = async () => {
    if (!token) return;
    
    const formValues = Object.values(address);
    if (formValues.some(field => field.trim() === '')) {
      toast.error('Please fill in all address fields');
      return;
    }

    if (Object.values(errors).some(error => error)) {
        toast.error('Please fix the errors before saving');
        return;
    }

    setIsLoading(true);
    try {
      const response = await api.addUserAddress(token, {
        line1: address.street, ...address 
      });
      
      setAddresses(response.addresses);
      handleAddressSelect(response.address._id); // Select the newly added address
      toast.success('Address saved successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save address');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting an address
  const handleDeleteAddress = async (addressId: string) => {
    if (!token) return;
    
    try {
      const response = await api.deleteUserAddress(token, addressId);
      setAddresses(response.addresses);
      
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

  return (
    <div>
      <h2 className="text-2xl font-serif text-heading-color mb-4">Shipping Address</h2>
      
      {/* Saved Addresses List */}
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
                    <div>
                      <p className="font-medium text-heading-color">{addr.line1}</p>
                      <p className="text-text-color">{addr.city}, {addr.postalCode}</p>
                      <p className="text-text-color">{addr.country}</p>
                      <p className="text-text-color">{addr.contactNumber}</p>
                    </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr._id); }}
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
            <Plus size={16} /> Add New Address
          </button>
        </div>
      )}

      {/* New Address Form */}
      {showNewAddressForm && (
        <div className="p-6 bg-secondary-bg/60 rounded-lg space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-heading-color">
              {addresses.length > 0 ? 'Add New Address' : 'Enter Shipping Address'}
            </h3>
            {addresses.length > 0 && (
              <button onClick={() => setShowNewAddressForm(false)} className="text-sm text-text-color hover:text-heading-color">
                Cancel
              </button>
            )}
          </div>
          
          <Input id="contactNumber" name="contactNumber" label="Contact Number" type="tel" value={address.contactNumber} onChange={handleChange} maxLength={10} error={errors.contactNumber} required />
          <Input id="street" name="street" label="Street Address" value={address.street} onChange={handleChange} error={errors.street} required />
          <div className="grid grid-cols-2 gap-4">
            <Input id="city" name="city" label="City" value={address.city} onChange={handleChange} error={errors.city} required />
            <Input id="postalCode" name="postalCode" label="Postal Code" type="tel" value={address.postalCode} onChange={handleChange} maxLength={6} error={errors.postalCode} required />
          </div>
          <Input id="country" name="country" label="Country" value={address.country} onChange={handleChange} error={errors.country} required />
          
          <button
            onClick={handleSaveAddress}
            disabled={isLoading}
            className="w-full bg-accent text-white font-semibold rounded-md py-3 px-4 transition-all hover:bg-accent-hover disabled:bg-accent/50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Address'}
          </button>
        </div>
      )}
    </div>
  );
}