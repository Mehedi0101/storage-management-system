const { z } = require("zod");

const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name is required"),
        email: z.string().email("Invalid email"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    }),
});

const loginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email"),
        password: z.string().min(1, "Password is required"),
    }),
});

const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email"),
    }),
});

const verifyCodeSchema = z.object({
    body: z.object({
        email: z.string().email(),
        code: z.string().length(6, "Invalid code"),
    }),
});

const resetPasswordSchema = z.object({
    body: z.object({
        email: z.string().email(),
        code: z.string().length(6),
        newPassword: z.string().min(6, "Password must be at least 6 characters"),
    }),
});

module.exports = {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    verifyCodeSchema,
    resetPasswordSchema
};