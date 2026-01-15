const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },

        storageLimit: {
            type: Number,
            default: 15 * 1024 * 1024 * 1024,
        },

        usedStorage: {
            type: Number,
            default: 0,
        },

        favorites: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "File",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;