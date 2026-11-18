// API configuration for local development and production

const backendDomin =
  window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : import.meta.env.VITE_BACKEND_URL || "https://joyceperfumer.onrender.com";

const SummaryApi = {
  // Authentication
  signUP: {
    url: `${backendDomin}/api/signup`,
    method: "post",
  },

  signIn: {
    url: `${backendDomin}/api/signin`,
    method: "post",
  },

  mpesaPayment: {
    url: `${backendDomin}/api/mpesa-stk-push`,
    method: "post",
  },

  current_user: {
    url: `${backendDomin}/api/user-details`,
    method: "get",
  },

  logout_user: {
    url: `${backendDomin}/api/userLogout`,
    method: "get",
  },

  // Users
  allUser: {
    url: `${backendDomin}/api/all-user`,
    method: "get",
  },

  updateUser: {
    url: `${backendDomin}/api/update-user`,
    method: "post",
  },

  // Products
  uploadProduct: {
    url: `${backendDomin}/api/upload-product`,
    method: "post",
  },

  allProduct: {
    url: `${backendDomin}/api/get-product`,
    method: "get",
  },

  updateProduct: {
    url: `${backendDomin}/api/update-product`,
    method: "post",
  },

  deleteProduct: {
    url: `${backendDomin}/api/delete-product`,
    method: "post",
  },

  // Categories
  categoryProduct: {
    url: `${backendDomin}/api/get-categoryProduct`,
    method: "get",
  },

  categoryWiseProduct: {
    url: `${backendDomin}/api/category-product`,
    method: "post",
  },

  // Product details
  productDetails: {
    url: `${backendDomin}/api/product-details`,
    method: "post",
  },

  // Cart
  addToCartProduct: {
    url: `${backendDomin}/api/addtocart`,
    method: "post",
  },

  addToCartProductCount: {
    url: `${backendDomin}/api/countAddToCartProduct`,
    method: "get",
  },

  addToCartProductView: {
    url: `${backendDomin}/api/view-card-product`,
    method: "get",
  },

  updateCartProduct: {
    url: `${backendDomin}/api/update-cart-product`,
    method: "post",
  },

  deleteCartProduct: {
    url: `${backendDomin}/api/delete-cart-product`,
    method: "post",
  },

  // Search and filter
  searchProduct: {
    url: `${backendDomin}/api/search`,
    method: "get",
  },

  filterProduct: {
    url: `${backendDomin}/api/filter-product`,
    method: "post",
  },

  // Financial Analytics & Sales Report
  salesReport: {
    url: `${backendDomin}/api/sales-report`,
    method: "get",
  },

  // Professional Admin Fulfillment & Customer Tracking Endpoints
  adminAllOrders: {
    url: `${backendDomin}/api/admin/all-orders`,
    method: "get",
  },

  adminUpdateOrderStatus: {
    url: `${backendDomin}/api/admin/update-order-status`,
    method: "post",
  },

  userOrders: {
    url: `${backendDomin}/api/user-orders`,
    method: "get",
  },
};

export default SummaryApi;
