const File = require("../models/File");

const TOTAL_STORAGE_LIMIT = 15 * 1024 * 1024 * 1024; // 15 gb

const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // stat aggregation
        const stats = await File.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: null,
                    totalSize: { $sum: "$size" },
                    totalFiles: { $sum: 1 },
                    imageCount: {
                        $sum: {
                            $cond: [{ $eq: ["$fileType", "image"] }, 1, 0],
                        },
                    },
                    pdfCount: {
                        $sum: {
                            $cond: [{ $eq: ["$fileType", "pdf"] }, 1, 0],
                        },
                    },
                    favoriteCount: {
                        $sum: {
                            $cond: ["$isFavorite", 1, 0],
                        },
                    },
                },
            },
        ]);

        const data = stats[0] || {
            totalSize: 0,
            totalFiles: 0,
            imageCount: 0,
            pdfCount: 0,
            favoriteCount: 0,
        };

        res.status(200).json({
            success: true,
            data: {
                totalStorage: TOTAL_STORAGE_LIMIT,
                usedStorage: data.totalSize,
                remainingStorage: TOTAL_STORAGE_LIMIT - data.totalSize,
                totalFiles: data.totalFiles,
                images: data.imageCount,
                pdfs: data.pdfCount,
                favorites: data.favoriteCount,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to load dashboard data",
        });
    }
};

module.exports = {
    getDashboardStats,
};