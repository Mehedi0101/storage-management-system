// external imports
const express = require("express");

// internal imports
const { register, login, logout } = require("../controllers/authController");
const validate = require("../utils/validate");
const { registerSchema, loginSchema } = require("../validations/authValidation");

const authRouter = express.Router();

// register route
authRouter.post("/register", validate(registerSchema), register);

// login route
authRouter.post("/login", validate(loginSchema), login);

// logout route
authRouter.post("/logout", logout);

module.exports = authRouter;
