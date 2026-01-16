// external imports
const fs = require("fs");
const path = require("path");

// internal imports
const File = require("../models/File");
const User = require("../models/User");



// file upload controller
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

        await User.findByIdAndUpdate(req.user._id, {
            $inc: { usedStorage: req.file.size },
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


// toggle favorite controller
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


// get files by date controller
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


// delete file controller
const deleteFile = async (req, res) => {
    try {
        const { fileId } = req.params;

        // find file with ownership check
        const file = await File.findOne({
            _id: fileId,
            user: req.user._id,
        });

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found",
            });
        }

        // delete from disk
        const absolutePath = path.resolve(file.path);

        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
        }

        // delete from DB
        await file.deleteOne();

        res.status(200).json({
            success: true,
            message: "File deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete file",
        });
    }
};


// get recently uploaded contents (limit 5)
const getRecentUploads = async (req, res) => {
    try {
        const files = await File.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            data: files,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch recent uploads",
        });
    }
};

// get all images
const getAllImages = async (req, res) => {
    try {
        const images = await File.find({
            user: req.user._id,
            fileType: "image",
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: images,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch images",
        });
    }
};

// get all pdfs
const getAllPdfs = async (req, res) => {
    try {
        const pdfs = await File.find({
            user: req.user._id,
            fileType: "pdf",
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: pdfs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch PDFs",
        });
    }
};

// get a file by it's id
const getFileById = async (req, res) => {
    try {
        const file = await File.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found",
            });
        }

        res.status(200).json({
            success: true,
            data: file,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid file ID",
        });
    }
};


module.exports = {
    uploadFile,
    toggleFavorite,
    getFilesByDate,
    deleteFile,
    getRecentUploads,
    getAllImages,
    getAllPdfs,
    getFileById
};