// // components/auth/RegisterForm.tsx
// "use client";

// import { useState } from 'react';
// import { useAuth } from '@/hooks/useAuth'; // We'll create this hook next
// import { Input } from '@/components/common/Input';

// export function RegisterForm() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const { register } = useAuth();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);

//     if (password.length < 6) {
//       setError('Password must be at least 6 characters long.');
//       setIsLoading(false);
//       return;
//     }

//     try {
//       await register({ name, email, password });
//       // The context will handle redirection upon successful registration
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
//         id="name"
//         label="Full Name"
//         type="text"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         required
//         placeholder="Heet Mehta"
//       />
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
//         {isLoading ? 'Creating Account...' : 'Create Account'}
//       </button>
//     </form>
//   );
// }