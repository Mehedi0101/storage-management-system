const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isImage = file.mimetype.startsWith("image/");
        cb(
            null,
            isImage ? "src/uploads/images" : "src/uploads/pdfs"
        );
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            uniqueName + path.extname(file.originalname)
        );
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "application/pdf",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("File type not allowed"), false);
    }

    cb(null, true);
};

const upload = multer({
    storage,
    limits: {
        // max size 5mb
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter,
});

module.exports = upload;