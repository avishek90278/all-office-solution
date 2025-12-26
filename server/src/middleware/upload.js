const multer = require('multer');
const path = require('path');
const fileUtils = require('../utils/fileUtils');

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // fileUtils ensures directories exist on startup, but we can use the temp dir path
        cb(null, path.join(__dirname, '../../temp'));
    },
    filename: (req, file, cb) => {
        // Use fileUtils to generate unique name (or just keep simple here and let fileUtils handle full path logic elsewhere)
        // Actually, multer needs to save it somewhere first.
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    try {
        // We can use fileUtils.validateFile but it expects a file object with size which we don't have yet in filter
        // So we keep basic mime check here or duplicate logic.
        // Let's keep basic mime check here for Multer.
        const allowedTypes = [
            'application/pdf',
            'image/png',
            'image/jpeg',
            'image/jpg',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/html'
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type.'), false);
        }
    } catch (err) {
        cb(err, false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

module.exports = upload;
