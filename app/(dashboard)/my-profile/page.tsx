// app/(dashboard)/my-profile/page.tsx
"use client"; // This page uses hooks to get auth state and fetch data on the client

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import * as api from '@/lib/api';

export default function MyProfilePage() {
  const { user, token } = useAuth(); // Get user from context as a fallback
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(true);

  // We re-fetch the data here to get the most up-to-date information (like addresses)
  useEffect(() => {
    if (token) {
      api.getCurrentUser(token)
        .then(data => setProfile(data))
        .catch(err => console.error("Failed to fetch profile:", err))
        .finally(() => setLoading(false));
    }
  }, [token]);

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!profile) {
    return <div>Could not load profile.</div>;
  }
  
  return (
    <div className="bg-secondary-bg/60 p-8 rounded-lg shadow-sm">
      <h1 className="text-3xl font-serif text-heading-color mb-6 border-b border-secondary-bg pb-4">
        My Profile
      </h1>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-text-color">Name</label>
          <p className="text-lg text-heading-color font-semibold">{profile.name}</p>
        </div>
        <div>
          <label className="text-sm text-text-color">Email</label>
          <p className="text-lg text-heading-color font-semibold">{profile.email}</p>
        </div>
        {profile.contactNumber && (
          <div>
            <label className="text-sm text-text-color">Contact Number</label>
            <p className="text-lg text-heading-color font-semibold">{profile.contactNumber}</p>
          </div>
        )}
        {profile.role === 'admin' && (
          <div>
            <label className="text-sm text-text-color">Role</label>
            <p className="text-lg text-heading-color font-semibold capitalize">{profile.role}</p>
          </div>
        )}
        {/* We will add an "Edit Profile" feature later */}
      </div>
    </div>
  );
}