const File = require("../models/File");

const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const isImage = req.file.mimetype.startsWith("image/");

        const file = await File.create({
            user: req.user._id,
            originalName: req.file.originalname,
            fileName: req.file.filename,
            fileType: isImage ? "image" : "pdf",
            mimeType: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
        });

        res.status(201).json({
            success: true,
            data: file,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "File upload failed",
        });
    }
};

module.exports = {
    uploadFile,
};