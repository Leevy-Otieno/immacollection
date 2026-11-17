const userModel = require('../../models/userModel');

const deleteUserController = async (req, res) => {
    try {
        const sessionUserId = req.userId; // Provided by authToken middleware
        const { userId } = req.body;      // The ID of the user to delete

        // Prevent admin from accidentally deleting their own account while logged in
        if (sessionUserId === userId) {
            return res.status(400).json({
                message: "You cannot delete your own active admin account.",
                error: true,
                success: false
            });
        }

        const deletedUser = await userModel.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found.",
                error: true,
                success: false
            });
        }

        res.json({
            message: "User deleted successfully.",
            success: true,
            error: false,
            data: deletedUser
        });

    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = deleteUserController;