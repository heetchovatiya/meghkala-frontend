// // contexts/AuthContext.tsx
// "use client";

// import { createContext, useState, useEffect, ReactNode } from 'react';
// import * as api from '@/lib/api';
// import { useRouter } from 'next/navigation';

// // Define the shape of our context data for TypeScript
// interface AuthContextType {
//   user: any; // You can create a more specific User type later
//   token: string | null;
//   login: (credentials: any) => Promise<void>;
//   register: (userData: any) => Promise<void>;
//   logout: () => void;
//   loading: boolean;
//   isAuthenticated: boolean;
// }

// // Create the context with a default value of null
// const AuthContext = createContext<AuthContextType | null>(null);

// // This is the Provider component that will wrap our application
// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true); // To handle initial auth check
//   const router = useRouter();

//   // On initial app load, check for a token in browser's local storage
//   useEffect(() => {
//     const storedToken = localStorage.getItem('authToken');
//     if (storedToken) {
//       setToken(storedToken);
//       api.getCurrentUser(storedToken)
//         .then(data => setUser(data))
//         .catch(() => {
//           // If token is invalid, clear everything
//           localStorage.removeItem('authToken');
//           setToken(null);
//           setUser(null);
//         })
//         .finally(() => setLoading(false));
//     } else {
//       setLoading(false); // No token found, we're done loading
//     }
//   }, []);

//   // Function to handle user login
//   const login = async (credentials: any) => {
//     const data = await api.loginUser(credentials);
//     setUser(data);
//     setToken(data.token);
//     localStorage.setItem('authToken', data.token);
//     router.push('/my-profile'); // Redirect to their profile after login
//   };

//   // Function to handle user registration
//   const register = async (userData: any) => {
//     const data = await api.registerUser(userData);
//     setUser(data);
//     setToken(data.token);
//     localStorage.setItem('authToken', data.token);
//     router.push('/my-profile'); // Redirect after registration
//   };

//   // Function to handle user logout
//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem('authToken');
//     router.push('/login'); // Redirect to login page after logout
//   };

//   // The value provided to all consuming components
//   const value = {
//     user,
//     token,
//     login,
//     register,
//     logout,
//     loading,
//     isAuthenticated: !!token, // A handy boolean to quickly check if user is logged in
//   };

//   // We don't render children until the initial loading is complete
//   // to prevent UI flicker (e.g., showing "Login" then quickly switching to "Logout")
//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;

// contexts/AuthContext.tsx
// contexts/AuthContext.tsx
"use client";

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import * as api from '@/lib/api';
import { useRouter } from 'next/navigation';


interface AuthContextType {
  user: any;
  token: string | null;
  checkUserExists: (email: string) => Promise<{ exists: boolean; user: any }>;
  sendOtp: (email: string, name?: string, contactNumber?: string, isNewUser?: boolean) => Promise<void>;
  loginWithOtp: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(() => {
    // Clear state and storage, then redirect.
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    router.push('/login');
  }, [router]);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        try {
          // Verify the token with the backend
          const currentUser = await api.getCurrentUser(storedToken);
          // If successful, set the state
          setUser(currentUser);
          setToken(storedToken);
        } catch (error) {
          // If token is expired or invalid, log the user out
          console.error("Auth token validation failed", error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [logout]);

  const checkUserExists = async (email: string) => {
    return await api.checkUserExists(email);
  };

  const sendOtp = async (email: string, name?: string, contactNumber?: string, isNewUser?: boolean) => {
    await api.sendOtp(email, name, contactNumber, isNewUser);
  };

  const loginWithOtp = async (email: string, otp: string) => {
    // ✅ THIS IS THE CRITICAL FIX
    try {
      const data = await api.verifyOtp(email, otp);
      if (data && data.token) { // Ensure we got a valid response with a token
        setUser(data);
        setToken(data.token);
        localStorage.setItem('authToken', data.token); // Save the token
        router.push('/my-profile'); // Redirect on success
      } else {
        // Handle cases where the API might return a success status but no token
        throw new Error("Login failed: Invalid response from server.");
      }
    } catch (error) {
      console.error("Login with OTP failed:", error);
      // Re-throw the error so the LoginForm can display it
      throw error;
    }
  };

  const value = {
    user,
    token,
    checkUserExists,
    sendOtp,
    loginWithOtp,
    logout,
    loading,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;