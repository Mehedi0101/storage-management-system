const express = require("express");
const authMiddleware = require("../middlewares/authMiddlewares");
const upload = require("../middlewares/uploadMiddleware");
const { uploadFile } = require("../controllers/fileController");

const fileRouter = express.Router();

fileRouter.post("/upload", authMiddleware, upload.single("file"), uploadFile);

module.exports = fileRouter;
