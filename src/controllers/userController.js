// external imports
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

// internal imports
const User = require("../models/User");
const File = require("../models/File");


// update user email
const updateUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name && !email) {
            return res.status(400).json({
                success: false,
                message: "Nothing to update",
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, email },
            { new: true, runValidators: true }
        ).select("-password");

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update user",
        });
    }
};


// update user password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Both passwords are required",
            });
        }

        const user = await User.findById(req.user._id).select("+password");

        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to change password",
        });
    }
};


// delete user account
const deleteUser = async (req, res) => {
    try {
        // Get user's files
        const files = await File.find({ user: req.user._id });

        // Delete files from disk
        for (const file of files) {
            const filePath = path.resolve(file.path);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Delete file records
        await File.deleteMany({ user: req.user._id });

        // Delete user
        await User.findByIdAndDelete(req.user._id);

        // Clear cookie
        res.clearCookie("token");

        res.status(200).json({
            success: true,
            message: "User account deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete user",
        });
    }
};


// get current user info
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user",
        });
    }
};

module.exports = {
    updateUser,
    changePassword,
    deleteUser,
    getCurrentUser
};
