const express = require("express");
const { register } = require("../controllers/authController");
const validate = require("../utils/validate");
const { registerSchema } = require("../validations/authValidation");

const authRouter = express.Router();

authRouter.post("/register", validate(registerSchema), register);

module.exports = authRouter;
