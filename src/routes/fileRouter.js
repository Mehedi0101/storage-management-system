const express = require("express");
const authMiddleware = require("../middlewares/authMiddlewares");
const upload = require("../middlewares/uploadMiddleware");
const { uploadFile, toggleFavorite, getFilesByDate, deleteFile } = require("../controllers/fileController");

const fileRouter = express.Router();

// get file based on date
fileRouter.get("/by-date", authMiddleware, getFilesByDate);

// content uploading route
fileRouter.post("/upload", authMiddleware, upload.single("file"), uploadFile);

// favorite content toggling route
fileRouter.patch("/:fileId/favorite", authMiddleware, toggleFavorite);

// delete content route
fileRouter.delete("/:fileId", authMiddleware, deleteFile);

module.exports = fileRouter;
