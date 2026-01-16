// external imports
const bcrypt = require("bcrypt");

// internal imports
const User = require("../models/User");
const { generateToken } = require("../utils/jwt");
const PasswordReset = require("../models/PasswordReset");
const generateCode = require("../utils/generateCode");


// register
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // if already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error("Email already registered");
            error.statusCode = 400;
            throw error;
        }

        // password hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        // user creation
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // success response
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        next(error);
    }
};

// login
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        // if no user found from body
        if (!user) {
            const error = new Error("Invalid email or password");
            error.statusCode = 401;
            throw error;
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        // if password don't match
        if (!isPasswordMatch) {
            const error = new Error("Invalid email or password");
            error.statusCode = 401;
            throw error;
        }

        // token generation
        const token = generateToken({
            userId: user._id,
            email: user.email,
        });

        // cookie response
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // have to set true in production
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });

        // success response
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

// forgotPassword
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        // if no user found
        if (!user) {
            return res.status(200).json({
                success: true,
                message: "No user found associated with this email address",
            });
        }

        const code = generateCode();
        const hashedCode = await bcrypt.hash(code, 10);

        // password reset code
        await PasswordReset.create({
            userId: user._id,
            code: hashedCode,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        });

        // success response
        res.status(200).json({
            success: true,
            message: {
                to: email,
                subject: "Password Reset Code",
                text: `Your password reset code is ${code}`,
            }
        });
    } catch (error) {
        next(error);
    }
};

// verifyCode
const verifyCode = async (req, res, next) => {
    try {
        const { email, code } = req.body;

        const user = await User.findOne({ email });

        // if no user found
        if (!user) {
            const err = new Error("Invalid code");
            err.statusCode = 400;
            throw err;
        }

        const resetRecord = await PasswordReset.findOne({
            userId: user._id,
            isUsed: false,
            expiresAt: { $gt: new Date() },
        }).select("+code");

        if (!resetRecord) {
            const err = new Error("Invalid or expired code");
            err.statusCode = 400;
            throw err;
        }

        const isMatch = await bcrypt.compare(code, resetRecord.code);
        if (!isMatch) {
            const err = new Error("Invalid or expired code");
            err.statusCode = 400;
            throw err;
        }

        res.status(200).json({
            success: true,
            message: "Code verified",
        });
    } catch (error) {
        next(error);
    }
};

// reset password
const resetPassword = async (req, res, next) => {
    try {
        const { email, code, newPassword } = req.body;

        const user = await User.findOne({ email });

        // if no user found
        if (!user) {
            const err = new Error("Invalid request");
            err.statusCode = 400;
            throw err;
        }

        const resetRecord = await PasswordReset.findOne({
            userId: user._id,
            isUsed: false,
            expiresAt: { $gt: new Date() },
        }).select("+code");

        if (!resetRecord) {
            const err = new Error("Invalid or expired code");
            err.statusCode = 400;
            throw err;
        }

        const isMatch = await bcrypt.compare(code, resetRecord.code);
        if (!isMatch) {
            const err = new Error("Invalid or expired code");
            err.statusCode = 400;
            throw err;
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        resetRecord.isUsed = true;
        await resetRecord.save();

        res.status(200).json({
            success: true,
            message: "Password reset successful",
        });
    } catch (error) {
        next(error);
    }
};



// logout
const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};

module.exports = {
    register,
    login,
    logout,
    forgotPassword,
    verifyCode,
    resetPassword
};