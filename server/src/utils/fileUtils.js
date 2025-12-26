const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const TEMP_DIR = path.join(__dirname, '../../temp');
const UPLOAD_DIR = path.join(__dirname, '../../uploads');
const PROCESSED_DIR = path.join(__dirname, '../../processed');

// Ensure directories exist
(async () => {
    await fs.mkdir(TEMP_DIR, { recursive: true });
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.mkdir(PROCESSED_DIR, { recursive: true });
})();

const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
    'text/html'
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

exports.validateFile = (file) => {
    if (!file) throw new Error('No file provided');

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        throw new Error(`Invalid file type: ${file.mimetype}`);
    }

    if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File too large. Max size is ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    return true;
};

exports.generateTempFilePath = (originalName) => {
    const uniqueId = uuidv4();
    const ext = path.extname(originalName);
    return path.join(TEMP_DIR, `${uniqueId}${ext}`);
};

exports.getProcessedPath = (fileName) => {
    return path.join(PROCESSED_DIR, fileName);
};

exports.cleanupFiles = async (filePaths) => {
    if (!Array.isArray(filePaths)) filePaths = [filePaths];

    for (const filePath of filePaths) {
        if (!filePath) continue;
        try {
            await fs.unlink(filePath);
        } catch (err) {
            // Ignore if file doesn't exist
            if (err.code !== 'ENOENT') console.error(`Failed to cleanup ${filePath}:`, err.message);
        }
    }
};
