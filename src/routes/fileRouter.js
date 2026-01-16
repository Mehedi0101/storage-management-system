const express = require("express");
const authMiddleware = require("../middlewares/authMiddlewares");
const upload = require("../middlewares/uploadMiddleware");
const { uploadFile, toggleFavorite, getFilesByDate, deleteFile } = require("../controllers/fileController");

const fileRouter = express.Router();

// all routes of fileRouter is secured by authMiddleware
fileRouter.use(authMiddleware);

// get file based on date
fileRouter.get("/by-date", getFilesByDate);

// get recently uploaded files
fileRouter.get("/recent", getRecentUploads);

// get all uploaded images by a user
fileRouter.get("/images", getAllImages);

// get all pdf uploaded by a user
fileRouter.get("/pdfs", getAllPdfs);

// get a specific file by id
fileRouter.get("/:id", getFileById);

// content uploading route
fileRouter.post("/upload", upload.single("file"), uploadFile);

// favorite content toggling route
fileRouter.patch("/:fileId/favorite", toggleFavorite);

// delete content route
fileRouter.delete("/:fileId", deleteFile);

module.exports = fileRouter;
