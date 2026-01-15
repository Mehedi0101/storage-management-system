const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalName: String,
    fileName: String,
    fileType: {
      type: String,
      enum: ["image", "pdf"],
    },
    mimeType: String,
    size: Number,
    path: String,
    isFavorite: {
      type: Boolean,
      default: false,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);