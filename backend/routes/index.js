const express = require("express");
const router = express.Router();

// Import Controllers - User
const userSignUpController = require("../controller/user/userSignUp");
const userSignInController = require("../controller/user/userSignIn");
const userDetailsController = require("../controller/user/userDetails");
const userLogout = require("../controller/user/userLogout");
const allUsers = require("../controller/user/allUsers");
const updateUser = require("../controller/user/updateUser");

// Import Controllers - Product (Matching your exact filenames)
const UploadProductController = require("../controller/product/uploadProduct");
const getProductController = require("../controller/product/getProduct");
const updateProductController = require("../controller/product/updateProduct");
const deleteProductController = require("../controller/product/deleteProduct");
const getCategoryProduct = require("../controller/product/getCategoryProductOne");
const categoryWiseProduct = require("../controller/product/getCategoryWiseProduct");
const productDetailsController = require("../controller/product/getProductDetails");
const searchProduct = require("../controller/product/searchProduct");
const filterProductController = require("../controller/product/filterProduct");

// Import Controllers - Cart
const addToCartController = require("../controller/user/addToCartController");
const countAddToCartProduct = require("../controller/user/countAddToCartProduct");
const viewCartProduct = require("../controller/user/addToCartViewProduct");
const updateCartProduct = require("../controller/user/updateAddToCartProduct");
const deleteAddToCartProduct = require("../controller/user/deleteAddToCartProduct");

// Import Controllers - Payments, Reports & Orders (All inside mpesaController as per your tree)
const getSalesReportController = require("../controller/payments/salesReportController");
const {
  stkPushController,
  mpesaCallbackController,
  checkPaymentStatus,
  getUserOrdersController,
  getAllOrdersController,
  updateOrderStatusController,
} = require("../controller/payments/mpesaController");

// Import Middleware & Helpers (Declared ONCE)
const authToken = require("../middleware/authToken");
const authTokenRole = require("../helpers/permission");

// User Authentication & Management Routes
router.post("/signup", userSignUpController);
router.post("/signin", userSignInController);
router.get("/user-details", authToken, userDetailsController);
router.get("/userLogout", userLogout);

// Admin User Routes
router.get("/all-user", authToken, authTokenRole, allUsers);
router.post("/update-user", authToken, authTokenRole, updateUser);

// Product Routes
router.post(
  "/upload-product",
  authToken,
  authTokenRole,
  UploadProductController,
);
router.get("/get-product", getProductController);
router.post(
  "/update-product",
  authToken,
  authTokenRole,
  updateProductController,
);
router.post(
  "/delete-product",
  authToken,
  authTokenRole,
  deleteProductController,
);

// Category & Filter Routes
router.get("/get-categoryProduct", getCategoryProduct);
router.post("/category-product", categoryWiseProduct);
router.post("/product-details", productDetailsController);
router.get("/search", searchProduct);
router.post("/filter-product", filterProductController);

// Cart Routes
router.post("/addtocart", authToken, addToCartController);
router.get("/countAddToCartProduct", authToken, countAddToCartProduct);
router.get("/view-card-product", authToken, viewCartProduct);
router.post("/update-cart-product", authToken, updateCartProduct);
router.post("/delete-cart-product", authToken, deleteAddToCartProduct);

// M-Pesa & Payment Routes
router.post("/mpesa-stk-push", authToken, stkPushController);
router.post("/mpesa-callback", mpesaCallbackController);
router.get("/mpesa-status/:checkoutRequestID", authToken, checkPaymentStatus);

// Financial Reports & Order Tracking Routes
router.get("/sales-report", authToken, authTokenRole, getSalesReportController);
router.get("/user-orders", authToken, getUserOrdersController);
router.get(
  "/admin/all-orders",
  authToken,
  authTokenRole,
  getAllOrdersController,
);
router.post(
  "/admin/update-order-status",
  authToken,
  authTokenRole,
  updateOrderStatusController,
);

module.exports = router;
