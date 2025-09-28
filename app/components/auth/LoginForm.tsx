// // components/auth/LoginForm.tsx
// "use client";

// import { useState } from 'react';
// import { useAuth } from '@/hooks/useAuth';
// import { Input } from '@/components/common/Input';

// export function LoginForm() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const { login } = useAuth();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);

//     try {
//       await login({ email, password });
//       // The context will handle redirection
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-center">{error}</p>}
      
//       <Input 
//         id="email"
//         label="Email Address"
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//         placeholder="heet@example.com"
//       />
//       <Input 
//         id="password"
//         label="Password"
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         required
//         placeholder="••••••••"
//       />
      
//       <button 
//         type="submit" 
//         disabled={isLoading}
//         className="w-full bg-accent text-white font-semibold rounded-md py-3 text-lg
//                    transition-all duration-300 ease-in-out
//                    hover:bg-accent-hover disabled:bg-accent/50 disabled:cursor-not-allowed"
//       >
//         {isLoading ? 'Signing In...' : 'Sign In'}
//       </button>
//     </form>
//   );
// }

// components/auth/LoginForm.tsx
// components/auth/LoginForm.tsx
"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/common/Input';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [userChecked, setUserChecked] = useState(false);
  const [existingUser, setExistingUser] = useState<any>(null);
  const { checkUserExists, sendOtp, loginWithOtp } = useAuth();

  // Step 1: Check if user exists
  const handleCheckUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const result = await checkUserExists(email);
      setUserChecked(true);
      
      if (result.exists) {
        // Existing user - show their info and send OTP
        setExistingUser(result.user);
        setIsNewUser(false);
        await handleSendOtp(false); // Send OTP for existing user
      } else {
        // New user - show form for additional info
        setIsNewUser(true);
        setMessage("Welcome! Please provide your details to create an account.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Handle sending the OTP (for both new and existing users)
  const handleSendOtp = async (isNewUserFlow: boolean = true) => {
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      if (isNewUserFlow && isNewUser) {
        // Validate required fields for new users
        if (!name.trim() || !contactNumber.trim()) {
          setError('Name and contact number are required');
          setIsLoading(false);
          return;
        }
      }

      await sendOtp(email, name, contactNumber, isNewUser);
      setMessage("An OTP has been sent. Please check your email.");
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Handle verifying the OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      await loginWithOtp(email, otp); // ✅ CALLING loginWithOtp HERE
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Email input and user check
  if (!userChecked) {
    return (
      <form onSubmit={handleCheckUser} className="space-y-6">
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-center">{error}</p>}
        {message && <p className="bg-green-100 text-green-700 p-3 rounded-md text-center">{message}</p>}
        <p className="text-center text-text-color">Enter your email to get started.</p>
        
        <Input 
          id="email" 
          label="Email Address" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          placeholder="Enter your email address"
        />
        
        <button type="submit" disabled={isLoading} className="w-full bg-accent text-white font-semibold rounded-md py-3 text-lg transition-all hover:bg-accent-hover disabled:bg-accent/50">
          {isLoading ? 'Checking...' : 'Continue'}
        </button>
      </form>
    );
  }

  // Step 2: Show user info and additional details if needed
  if (!otpSent) {
    return (
      <div className="space-y-6">
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-center">{error}</p>}
        {message && <p className="bg-green-100 text-green-700 p-3 rounded-md text-center">{message}</p>}
        
        {/* Show existing user info */}
        {existingUser && (
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="font-semibold text-blue-800 mb-2">Welcome back!</h3>
            <p className="text-blue-700 text-sm">
              {existingUser.name} • {existingUser.contactNumber}
            </p>
          </div>
        )}
        
        {/* Show form for new users */}
        {isNewUser && (
          <form onSubmit={(e) => { e.preventDefault(); handleSendOtp(true); }} className="space-y-4">
            <p className="text-center text-text-color">Please provide your details to create an account.</p>
            
            <Input 
              id="name" 
              label="Full Name" 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required
              placeholder="Enter your full name"
            />
            <Input 
              id="contactNumber" 
              label="Contact Number" 
              type="tel" 
              value={contactNumber} 
              onChange={(e) => setContactNumber(e.target.value)} 
              required
              placeholder="Enter your phone number"
            />
            
            <button type="submit" disabled={isLoading} className="w-full bg-accent text-white font-semibold rounded-md py-3 text-lg transition-all hover:bg-accent-hover disabled:bg-accent/50">
              {isLoading ? 'Sending OTP...' : 'Send Login Code'}
            </button>
          </form>
        )}
        
        {/* Show OTP sending button for existing users */}
        {!isNewUser && existingUser && (
          <div className="text-center">
            <p className="text-text-color mb-4">We'll send a login code to your email.</p>
            <button 
              onClick={() => handleSendOtp(false)} 
              disabled={isLoading} 
              className="w-full bg-accent text-white font-semibold rounded-md py-3 text-lg transition-all hover:bg-accent-hover disabled:bg-accent/50"
            >
              {isLoading ? 'Sending OTP...' : 'Send Login Code'}
            </button>
          </div>
        )}
        
        {/* Back button */}
        <button 
          type="button" 
          onClick={() => { 
            setUserChecked(false); 
            setExistingUser(null); 
            setIsNewUser(false); 
            setError(''); 
            setMessage(''); 
          }} 
          className="w-full text-center text-sm text-text-color hover:underline"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleVerifyOtp} className="space-y-6">
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-center">{error}</p>}
      {message && <p className="bg-green-100 text-green-700 p-3 rounded-md text-center">{message}</p>}
      
      <div className="text-center mb-4">
        <p className="text-text-color">Enter the 6-digit code sent to</p>
        <p className="font-semibold text-heading-color">{email}</p>
      </div>
      
      <Input 
        id="otp" 
        label="6-Digit Code" 
        type="text" 
        value={otp} 
        onChange={(e) => setOtp(e.target.value)} 
        required 
        maxLength={6}
        placeholder="000000"
        className="text-center text-2xl tracking-widest"
      />
      
      <button type="submit" disabled={isLoading} className="w-full bg-accent text-white font-semibold rounded-md py-3 text-lg transition-all hover:bg-accent-hover disabled:bg-accent/50">
        {isLoading ? 'Verifying...' : 'Sign In'}
      </button>
      
      <button 
        type="button" 
        onClick={() => { 
          setOtpSent(false); 
          setUserChecked(false);
          setExistingUser(null);
          setIsNewUser(false);
          setError(''); 
          setMessage(''); 
        }} 
        className="w-full text-center text-sm text-text-color hover:underline mt-2"
      >
        Use a different email
      </button>
    </form>
  );
}