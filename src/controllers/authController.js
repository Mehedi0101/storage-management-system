// external imports
const bcrypt = require("bcrypt");

// internal imports
const User = require("../models/User");
const { generateToken } = require("../utils/jwt");


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
        if (!user) {
            const error = new Error("Invalid email or password");
            error.statusCode = 401;
            throw error;
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            const error = new Error("Invalid email or password");
            error.statusCode = 401;
            throw error;
        }

        const token = generateToken({
            userId: user._id,
            email: user.email,
        });

        // 🔐 Set HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // set true in production (HTTPS)
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

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
    logout
};