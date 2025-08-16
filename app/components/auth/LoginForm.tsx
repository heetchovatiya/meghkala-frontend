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
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const { sendOtp, loginWithOtp } = useAuth(); // Now 'sendOtp' will be used

  // Step 1: Handle sending the OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      await sendOtp(email); // ✅ CALLING sendOtp HERE
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

  if (!otpSent) {
    return (
      <form onSubmit={handleSendOtp} className="space-y-6">
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-center">{error}</p>}
        <p className="text-center text-text-color">Enter your email to receive a login code.</p>
        <Input id="email" label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit" disabled={isLoading} className="w-full bg-accent text-white font-semibold rounded-md py-3 text-lg transition-all hover:bg-accent-hover disabled:bg-accent/50">
          {isLoading ? 'Sending...' : 'Send Login Code'}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleVerifyOtp} className="space-y-6">
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-center">{error}</p>}
      {message && <p className="bg-green-100 text-green-700 p-3 rounded-md text-center">{message}</p>}
      <Input id="otp" label="6-Digit Code" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6} />
      <button type="submit" disabled={isLoading} className="w-full bg-accent text-white font-semibold rounded-md py-3 text-lg transition-all hover:bg-accent-hover disabled:bg-accent/50">
        {isLoading ? 'Verifying...' : 'Sign In'}
      </button>
      <button type="button" onClick={() => { setOtpSent(false); setError(''); setMessage(''); }} className="w-full text-center text-sm text-text-color hover:underline mt-2">
        Use a different email
      </button>
    </form>
  );
}