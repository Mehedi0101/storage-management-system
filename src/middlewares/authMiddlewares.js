const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        // if no token found
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Token missing.",
            });
        }

        // token verification
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // get user if token verification successful
        const user = await User.findById(decoded.userId).select("-password");

        // if no user found
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. User not found.",
            });
        }

        // if user found
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized. Invalid or expired token.",
        });
    }
};

module.exports = authMiddleware;