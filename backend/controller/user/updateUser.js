const userModel = require("../../models/userModel");

async function updateUser(req, res) {
  try {
    const sessionUser = req.userId;
    const { userId, email, name, role } = req.body;

    const payload = {
      ...(email && { email: email }),
      ...(name && { name: name }),
      ...(role && { role: role }),
    };

    const user = await userModel.findById(sessionUser);

    if (user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Permission denied. Only admins can update user roles.",
        error: true,
        success: false,
      });
    }

    const updatedUser = await userModel.findByIdAndUpdate(userId, payload, {
      new: true,
    });

    res.json({
      data: updatedUser,
      message: "User updated successfully",
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

module.exports = updateUser;
