const mongoose = require("mongoose");

const passwordResetSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        code: {
            type: String,
            required: true,
            select: false,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        isUsed: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("PasswordReset", passwordResetSchema);