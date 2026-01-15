const bcrypt = require("bcrypt");
const User = require("../models/User");

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

module.exports = {
    register,
};