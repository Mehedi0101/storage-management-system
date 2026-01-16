const express = require("express");
const authMiddleware = require("../middlewares/authMiddlewares");
const upload = require("../middlewares/uploadMiddleware");
const { uploadFile, toggleFavorite } = require("../controllers/fileController");

const fileRouter = express.Router();

// content uploading router
fileRouter.post("/upload", authMiddleware, upload.single("file"), uploadFile);

// favorite content toggling router
fileRouter.patch("/:fileId/favorite", authMiddleware, toggleFavorite);

module.exports = fileRouter;
