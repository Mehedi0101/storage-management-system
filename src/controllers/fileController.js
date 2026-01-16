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

const toggleFavorite = async (req, res) => {
    try {
        const { fileId } = req.params;

        const file = await File.findOne({
            _id: fileId,
            user: req.user._id, // ownership enforcement
        });

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found",
            });
        }

        file.isFavorite = !file.isFavorite;
        await file.save();

        res.status(200).json({
            success: true,
            message: file.isFavorite
                ? "Added to favorites"
                : "Removed from favorites",
            data: {
                fileId: file._id,
                isFavorite: file.isFavorite,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update favorite status",
        });
    }
};

const getFilesByDate = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: "Date query parameter is required (YYYY-MM-DD)",
            });
        }

        // Start and end of the day
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        const files = await File.find({
            user: req.user._id,
            createdAt: {
                $gte: startDate,
                $lte: endDate,
            },
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: files.length,
            data: files,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch files",
        });
    }
};


module.exports = {
    uploadFile,
    toggleFavorite,
    getFilesByDate
};