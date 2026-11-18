const userModel = require("../models/userModel");

const authTokenRole = async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. Please log in again.",
        success: false,
        error: true,
      });
    }

    const user = await userModel.findById(userId);

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Access denied. Admin resources only.",
        success: false,
        error: true,
      });
    }

    next();
  } catch (err) {
    console.error("Permission Middleware Error:", err.message);
    return res.status(500).json({
      message: err.message || "Internal Server Error",
      success: false,
      error: true,
    });
  }
};

// Also keep a helper function exported if other files import it directly for products
const uploadProductPermission = async (userId) => {
  try {
    if (!userId) return false;
    const user = await userModel.findById(userId);
    return user && user.role === "ADMIN";
  } catch (err) {
    return false;
  }
};

module.exports = authTokenRole;
module.exports.uploadProductPermission = uploadProductPermission;
