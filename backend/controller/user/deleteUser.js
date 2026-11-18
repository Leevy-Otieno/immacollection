const userModel = require("../../models/userModel");

async function deleteUser(req, res) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        error: true,
        success: false,
      });
    }

    const deletedUser = await userModel.findByIdAndDelete(userId);

    res.json({
      data: deletedUser,
      message: "User Deleted Successfully",
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}

module.exports = deleteUser;
