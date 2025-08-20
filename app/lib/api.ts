// lib/api.ts

// --- Core API Utility ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';


// A universal fetcher function to handle requests, responses, and errors.
async function fetcher(url: string, options: RequestInit = {}) {
  // ✅ --- THIS IS THE FIX --- ✅
  // We add a `cache` option to the fetch call.
  // 'no-store' tells Next.js: "Never cache the result of this specific API call."
  // This forces it to go to your backend every single time you visit the page.
  const response = await fetch(`${API_BASE_URL}/api${url}`, {
    ...options,
    next: {
      revalidate:0   
    }
   });
  // ✅ ------------------------- ✅
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Something went wrong');
  }
  
  if (response.status === 204) { return; }
  
  return response.json();
}
  

// =========================================================================
// Module 1: Authentication & User Management
// =========================================================================

// Public: Register a new user.
export const registerUser = (userData: object) => fetcher('/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(userData),
});

// Public: Log in with email and password.
export const loginUser = (credentials: object) => fetcher('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(credentials),
});

// Public: Send an OTP for passwordless login.
export const sendOtp = (email: string) => fetcher('/auth/otp/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email }),
});

// Public: Verify OTP and log in.
export const verifyOtp = (email: string, otp: string) => fetcher('/auth/otp/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, otp }),
});

// Private: Get the currently logged-in user's profile.
export const getCurrentUser = (token: string) => fetcher('/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` },
});

// Private: Update the current user's profile.
export const updateCurrentUser = (token: string, profileData: object) => fetcher('/auth/me', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify(profileData),
});


// =========================================================================
// Module 2: Products & Categories
// =========================================================================

// Public: Get all products with optional filtering.
export const getProducts = (params?: { keyword?: string; category?: string; availability?: string; sort?: string }) => {
  // Create a new, clean params object
  const cleanParams: Record<string, string> = {};

  // Only add parameters to the new object if they have a truthy value
  // This will skip null, undefined, and empty strings ('')
  if (params?.keyword) {
    cleanParams.keyword = params.keyword;
  }
  if (params?.category) {
    cleanParams.category = params.category;
  }
  if (params?.availability) {
    cleanParams.availability = params.availability;
  }
  if (params?.sort) {
    cleanParams.sort = params.sort;
  }

  // Convert the clean object to a query string.
  // If the object is empty, this will correctly result in an empty string.
  const query = new URLSearchParams(cleanParams).toString();
  
  // Conditionally add the '?' to the URL only if there is a query string
  const url = query ? `/products?${query}` : '/products';
  
  return fetcher(url);
};
// Public: Get a single product by its ID.
export const getProductById = (id: string) => fetcher(`/products/${id}`);

// Public: Get all categories.
export const getCategories = () => fetcher('/products/categories');

// Private: Request notification for an out-of-stock item.
export const requestProductNotification = (token: string, productId: string) => fetcher(`/products/${productId}/notify`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
});


// =========================================================================
// Module 3: Image Uploads (Admin)
// =========================================================================

// Admin: Upload an image. Note: The body is FormData, not JSON.
export const uploadImage = (token: string, imageFile: File) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  // The 'url' passed to fetcher is '/upload'
  // The final URL will be http://localhost:5001/api/upload
  return fetcher('/upload', {
    method: 'POST',
    headers: {
      // DO NOT set 'Content-Type': 'multipart/form-data'. 
      // The browser needs to set it automatically along with the boundary.
      'Authorization': `Bearer ${token}`, 
    },
    body: formData,
  });
};
// =========================================================================
// Module 4: Orders
// =========================================================================

// Private: Create a new order.
export const createOrder = (token: string, orderData: object) => fetcher('/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify(orderData),
});

// ✅ NEW: Upload a payment screenshot for a specific order.
export const uploadPaymentScreenshot = (token: string, orderId: string, screenshotFile: File) => {
  const formData = new FormData();
  formData.append('screenshot', screenshotFile); // Key must be 'screenshot'

  return fetcher(`/orders/${orderId}/upload-screenshot`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }, // No Content-Type needed for FormData
    body: formData,
  });
};
// Private: Get the current user's orders.
export const getMyOrders = (token: string) => fetcher('/orders/myorders', {
  headers: { 'Authorization': `Bearer ${token}` },
});


// =========================================================================
// Module 5: Coupons
// =========================================================================

// 

// =========================================================================
// Module 6: Admin Panel Management APIs
// =========================================================================

// --- Admin Orders ---
export const adminGetAllOrders = (token: string) => fetcher('/orders', {
  headers: { 'Authorization': `Bearer ${token}` },
});

export const adminUpdateOrderStatus = (token: string, orderId: string, status: string) => 
  fetcher(`/orders/${orderId}/status`, { // <-- Is this URL correct?
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });

// --- Admin Products ---
export const adminCreateProduct = (token: string, productData: object) => fetcher('/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
  body: JSON.stringify(productData),
});

export const adminUpdateProduct = (token: string, productId: string, productData: object) => fetcher(`/products/${productId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
  body: JSON.stringify(productData),
});

export const adminDeleteProduct = (token: string, productId: string) => fetcher(`/products/${productId}`, {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${token}`},
});

// --- Admin Categories ---
export const adminCreateCategory = (token: string, categoryData: object) => fetcher('/products/categories', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
  body: JSON.stringify(categoryData),
});

export const adminDeleteCategory = (token: string, categoryId: string) => fetcher(`/products/categories/${categoryId}`, {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${token}`},
});

// --- Admin Coupons ---
export const adminCreateCoupon = (token: string, couponData: object) => fetcher('/coupons', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
  body: JSON.stringify(couponData),
});

export const adminGetAllCoupons = (token: string) => fetcher('/coupons', {
  headers: { 'Authorization': `Bearer ${token}`},
});

export const adminUpdateCoupon = (token: string, couponId: string, couponData: object) => fetcher(`/coupons/${couponId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
  body: JSON.stringify(couponData),
});

export const adminDeleteCoupon = (token: string, couponId: string) => fetcher(`/coupons/${couponId}`, {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${token}`},
});
// --- Admin Dashboard & Notifications ---
export const adminGetDashboardStats = (token: string) => fetcher('/dashboard/stats', {
  headers: { 'Authorization': `Bearer ${token}`},
});

export const adminGetNotificationRequests = (token: string) => fetcher('/dashboard/notifications', {
  headers: { 'Authorization': `Bearer ${token}`},
});

export const adminUpdateNotificationStatus = (token: string, notificationId: string, status: string) => fetcher(`/dashboard/notifications/${notificationId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({ status }),
});

console.log('API_BASE_URL:', API_BASE_URL);
