// external imports
const express = require("express");

// internal imports
const { register, login, logout, forgotPassword, verifyCode, resetPassword } = require("../controllers/authController");
const validate = require("../utils/validate");
const { registerSchema, loginSchema, forgotPasswordSchema, verifyCodeSchema, resetPasswordSchema } = require("../validations/authValidation");

const authRouter = express.Router();

// register route
authRouter.post("/register", validate(registerSchema), register);

// login route
authRouter.post("/login", validate(loginSchema), login);

// logout route
authRouter.post("/logout", logout);

// forgot password route
authRouter.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);

// otp verifier route
authRouter.post("/verify-code", validate(verifyCodeSchema), verifyCode);

// reset password route
authRouter.post("/reset-password", validate(resetPasswordSchema), resetPassword);

module.exports = authRouter;
