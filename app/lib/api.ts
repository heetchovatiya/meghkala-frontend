// lib/api.ts

// --- Core API Utility ---
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5002";

// A universal fetcher function to handle requests, responses, and errors.
async function fetcher(url: string, options: RequestInit = {}) {
  try {
    // Don't set Content-Type for FormData - let the browser set it automatically
    const headers: Record<string, string> = {};

    // Only set Content-Type to application/json if body is not FormData
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_BASE_URL}/api${url}`, {
      ...options,
      cache: "no-store", // Equivalent to revalidate: 0 for client-side
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = "Something went wrong";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        // If we can't parse the error response, use the status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return;
    }

    return response.json();
  } catch (error) {
    // Handle network errors, timeout, etc.
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Unable to connect to the server. Please check your internet connection and try again."
      );
    }
    throw error;
  }
}

// =========================================================================
// Module 1: Authentication & User Management
// =========================================================================

// Public: Register a new user.
export const registerUser = (userData: object) =>
  fetcher("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

// Public: Log in with email and password.
export const loginUser = (credentials: object) =>
  fetcher("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

// Public: Check if user exists by email
export const checkUserExists = (email: string) =>
  fetcher("/auth/check-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

// Public: Send an OTP for passwordless login.
export const sendOtp = (
  email: string,
  name?: string,
  contactNumber?: string,
  isNewUser?: boolean
) =>
  fetcher("/auth/otp/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, contactNumber, isNewUser }),
  });

// Public: Verify OTP and log in.
export const verifyOtp = (email: string, otp: string) =>
  fetcher("/auth/otp/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

// Private: Get the currently logged-in user's profile.
export const getCurrentUser = (token: string) =>
  fetcher("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

// Private: Update the current user's profile.
export const updateCurrentUser = (token: string, profileData: object) =>
  fetcher("/auth/me", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

// =========================================================================
// Module 1.1: Address Management
// =========================================================================

// Private: Get user's saved addresses
export const getUserAddresses = (token: string) =>
  fetcher("/auth/addresses", {
    headers: { Authorization: `Bearer ${token}` },
  });

// Private: Add a new address
export const addUserAddress = (
  token: string,
  addressData: {
    type?: string;
    line1: string;
    city: string;
    postalCode: string;
    country: string;
    contactNumber: string;
  }
) =>
  fetcher("/auth/addresses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(addressData),
  });

// Private: Update an existing address
export const updateUserAddress = (
  token: string,
  addressId: string,
  addressData: {
    type?: string;
    line1: string;
    city: string;
    postalCode: string;
    country: string;
    contactNumber: string;
  }
) =>
  fetcher(`/auth/addresses/${addressId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(addressData),
  });

// Private: Delete an address
export const deleteUserAddress = (token: string, addressId: string) =>
  fetcher(`/auth/addresses/${addressId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

// =========================================================================
// Module 2: Products & Categories
// =========================================================================

// Public: Get all products with optional filtering.
export const getProducts = (params?: {
  keyword?: string;
  category?: string;
  subcategory?: string;
  availability?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}) => {
  // Create a new, clean params object
  const cleanParams: Record<string, string> = {};

  // Only add parameters to the new object if they have a truthy value
  if (params?.keyword) cleanParams.keyword = params.keyword;
  if (params?.category) cleanParams.category = params.category;
  if (params?.subcategory) cleanParams.subcategory = params.subcategory;
  if (params?.availability) cleanParams.availability = params.availability;
  if (params?.featured) cleanParams.featured = params.featured.toString();
  if (params?.minPrice) cleanParams.minPrice = params.minPrice.toString();
  if (params?.maxPrice) cleanParams.maxPrice = params.maxPrice.toString();
  if (params?.sort) cleanParams.sort = params.sort;
  if (params?.page) cleanParams.page = params.page.toString();
  if (params?.limit) cleanParams.limit = params.limit.toString();

  const query = new URLSearchParams(cleanParams).toString();
  const url = query ? `/products?${query}` : "/products";

  return fetcher(url);
};
// Public: Get a single product by its ID.
export const getProductById = (id: string) => fetcher(`/products/${id}`);

// Public: Get all categories.
export const getCategories = (parentOnly?: boolean) => {
  const url = parentOnly
    ? "/products/categories?parentOnly=true"
    : "/products/categories";
  return fetcher(url);
};

// Public: Get subcategories for a parent category.
export const getSubcategories = (parentId: string) =>
  fetcher(`/products/categories/${parentId}/subcategories`);

// Public: Get featured products.
export const getFeaturedProducts = (limit?: number) => {
  const url = limit
    ? `/products/featured?limit=${limit}`
    : "/products/featured";
  return fetcher(url);
};

// Public: Search products.
export const searchProducts = (params: {
  q: string;
  category?: string;
  subcategory?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) => {
  const query = new URLSearchParams(params as any).toString();
  return fetcher(`/products/search?${query}`);
};

// Public: Get product reviews.
export const getProductReviews = (
  productId: string,
  params?: {
    page?: number;
    limit?: number;
    sort?: string;
  }
) => {
  const query = params ? new URLSearchParams(params as any).toString() : "";
  const url = query
    ? `/products/${productId}/reviews?${query}`
    : `/products/${productId}/reviews`;
  return fetcher(url);
};

// Private: Create a product review.
export const createReview = (
  token: string,
  reviewData: {
    productId: string;
    rating: number;
    title: string;
    comment: string;
    images?: string[];
  }
) =>
  fetcher(`/products/${reviewData.productId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reviewData),
  });

// Private: Update a product review.
export const updateReview = (
  token: string,
  reviewId: string,
  reviewData: {
    rating?: number;
    title?: string;
    comment?: string;
    images?: string[];
  }
) =>
  fetcher(`/products/reviews/${reviewId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reviewData),
  });

// Private: Delete a product review.
export const deleteReview = (token: string, reviewId: string) =>
  fetcher(`/products/reviews/${reviewId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

// Private: Request notification for an out-of-stock item.
export const requestProductNotification = (token: string, productId: string) =>
  fetcher(`/products/${productId}/notify`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

// =========================================================================
// Module 3: Image Uploads (Admin)
// =========================================================================

// Admin: Upload an image. Note: The body is FormData, not JSON.
export const uploadImage = (token: string, imageFile: File) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  console.log(
    "Uploading image file:",
    imageFile.name,
    "Size:",
    imageFile.size,
    "Type:",
    imageFile.type
  );

  // The 'url' passed to fetcher is '/upload'
  // The final URL will be http://localhost:5001/api/upload
  return fetcher("/upload", {
    method: "POST",
    headers: {
      // DO NOT set 'Content-Type': 'multipart/form-data'.
      // The browser needs to set it automatically along with the boundary.
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
};
// =========================================================================
// Module 4: Orders
// =========================================================================

// Private: Create a new order.
export const createOrder = (token: string, orderData: object) =>
  fetcher("/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

// ✅ NEW: Upload a payment screenshot for a specific order.
export const uploadPaymentScreenshot = (
  token: string,
  orderId: string,
  screenshotFile: File
) => {
  const formData = new FormData();
  formData.append("screenshot", screenshotFile); // Key must be 'screenshot'

  return fetcher(`/orders/${orderId}/upload-screenshot`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }, // No Content-Type needed for FormData
    body: formData,
  });
};
// Private: Get the current user's orders.
export const getMyOrders = (token: string) =>
  fetcher("/orders/myorders", {
    headers: { Authorization: `Bearer ${token}` },
  });

// =========================================================================
// Module 5: Shipping
// =========================================================================

// Public: Get all shipping methods.
export const getShippingMethods = () => fetcher("/shipping");

// Public: Get default shipping method.
export const getDefaultShippingMethod = () => fetcher("/shipping/default");

// Public: Calculate shipping cost.
export const calculateShippingCost = (data: {
  items: Array<{
    quantity: number;
    price: number;
  }>;
  country: string;
  shippingMethodId?: string;
  isFastDelivery?: boolean;
}) =>
  fetcher("/shipping/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

// =========================================================================
// Module 6: Coupons
// =========================================================================

// Public: Validate a coupon code.
export const validateCoupon = (code: string) =>
  fetcher(`/coupons/validate?code=${code}`);

// Private: Apply a coupon to cart.
export const applyCoupon = (token: string, code: string) =>
  fetcher("/coupons/apply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code }),
  });

//

// =========================================================================
// Module 6: Discounts
// =========================================================================

// Public: Get active discounts
export const getActiveDiscounts = () => fetcher("/discounts/active");

// Public: Calculate applicable discounts for cart
export const calculateDiscounts = (data: {
  items: any[];
  totalAmount: number;
}) =>
  fetcher("/discounts/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

// Private: Apply discount to order
export const applyDiscount = (
  token: string,
  data: {
    discountId: string;
    orderTotal: number;
  }
) =>
  fetcher("/discounts/apply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

// =========================================================================
// Module 7: Admin Panel Management APIs
// =========================================================================

// --- Admin Orders ---
export const adminGetAllOrders = (token: string) =>
  fetcher("/orders", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const adminUpdateOrderStatus = (
  token: string,
  orderId: string,
  status: string
) =>
  fetcher(`/orders/${orderId}/status`, {
    // <-- Is this URL correct?
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

// --- Admin Products ---
export const adminCreateProduct = (token: string, productData: object) =>
  fetcher("/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

export const adminUpdateProduct = (
  token: string,
  productId: string,
  productData: object
) =>
  fetcher(`/products/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

export const adminDeleteProduct = (token: string, productId: string) =>
  fetcher(`/products/${productId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

// --- Admin Product Discounts ---
export const adminApplyProductDiscount = (
  token: string,
  productId: string,
  discountData: {
    originalPrice: number;
    discountPercentage: number;
    discountStartDate?: string;
    discountEndDate?: string;
  }
) =>
  fetcher(`/products/${productId}/discount`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(discountData),
  });

export const adminRemoveProductDiscount = (token: string, productId: string) =>
  fetcher(`/products/${productId}/discount`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

export const adminApplyBulkDiscount = (
  token: string,
  discountData: {
    productIds?: string[];
    categoryId?: string;
    subcategoryId?: string;
    discountPercentage: number;
  }
) =>
  fetcher("/products/bulk-discount", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(discountData),
  });

// --- Admin Categories ---
export const adminCreateCategory = (token: string, categoryData: object) =>
  fetcher("/products/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });

export const adminDeleteCategory = (token: string, categoryId: string) =>
  fetcher(`/products/categories/${categoryId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

// --- Admin Coupons ---
export const adminCreateCoupon = (token: string, couponData: object) =>
  fetcher("/coupons", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(couponData),
  });

export const adminGetAllCoupons = (token: string) =>
  fetcher("/coupons", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const adminUpdateCoupon = (
  token: string,
  couponId: string,
  couponData: object
) =>
  fetcher(`/coupons/${couponId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(couponData),
  });

export const adminDeleteCoupon = (token: string, couponId: string) =>
  fetcher(`/coupons/${couponId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

// --- Admin Discounts ---
export const adminCreateDiscount = (token: string, discountData: object) =>
  fetcher("/discounts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(discountData),
  });

export const adminGetAllDiscounts = (token: string) =>
  fetcher("/discounts", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const adminUpdateDiscount = (
  token: string,
  discountId: string,
  discountData: object
) =>
  fetcher(`/discounts/${discountId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(discountData),
  });

export const adminDeleteDiscount = (token: string, discountId: string) =>
  fetcher(`/discounts/${discountId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

// --- Admin Dashboard & Notifications ---
export const adminGetDashboardStats = (token: string) =>
  fetcher("/dashboard/stats", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const adminGetNotificationRequests = (token: string) =>
  fetcher("/dashboard/notifications", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const adminUpdateNotificationStatus = (
  token: string,
  notificationId: string,
  status: string
) =>
  fetcher(`/dashboard/notifications/${notificationId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

// ===== NOTIFICATION FUNCTIONS =====

// Public: Create stock notification request
export const createStockNotification = (productId: string, email: string) =>
  fetcher("/notifications/stock-alert", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId, email }),
  });

// Protected: Get user's stock notifications
export const getUserStockNotifications = (token: string) =>
  fetcher("/notifications/stock-alerts", {
    headers: { Authorization: `Bearer ${token}` },
  });

// Protected: Cancel stock notification
export const cancelStockNotification = (
  token: string,
  notificationId: string
) =>
  fetcher(`/notifications/stock-alert/${notificationId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

// Admin: Send stock notifications for a product
export const sendStockNotifications = (token: string, productId: string) =>
  fetcher(`/notifications/send-stock-alerts/${productId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

// Admin: Get all stock notifications
export const getAllStockNotifications = (token: string) =>
  fetcher("/notifications/admin/stock-alerts", {
    headers: { Authorization: `Bearer ${token}` },
  });
