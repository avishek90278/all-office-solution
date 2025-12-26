const mergeModule = require('../modules/mergeModule');
const splitModule = require('../modules/splitModule');
const organizeModule = require('../modules/organizeModule');
const securityModule = require('../modules/securityModule');
const editModule = require('../modules/editModule');
const convertModule = require('../modules/convertModule');
const compressModule = require('../modules/compressModule');
const repairModule = require('../modules/repairModule');
const ocrModule = require('../modules/ocrModule');
const officeModule = require('../modules/officeModule');
const aiModule = require('../modules/aiModule');
const queueModule = require('../modules/queueModule');
const fileUtils = require('../utils/fileUtils');
const errorUtils = require('../utils/errorUtils');

// Helper to handle response
const handleResponse = async (res, operationPromise, reqFiles) => {
    try {
        const result = await operationPromise;
        // Cleanup uploads
        if (reqFiles) {
            const filesToClean = Array.isArray(reqFiles) ? reqFiles.map(f => f.path) : [reqFiles.path];
            await fileUtils.cleanupFiles(filesToClean);
        }
        res.json({ message: 'Success', downloadUrl: `/downloads/${result.fileName}`, ...result });
    } catch (error) {
        const normalized = errorUtils.normalizeError(error);
        res.status(normalized.status).json({ error: normalized.message });
    }
};

exports.merge = (req, res) => {
    if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files uploaded' });
    handleResponse(res, mergeModule.process(req.files), req.files);
};

exports.split = (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    handleResponse(res, splitModule.process(req.file, req.body.range), req.file);
};

exports.organize = (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const pages = JSON.parse(req.body.pages || '[]');
    handleResponse(res, organizeModule.process(req.file, pages), req.file);
};

exports.protect = (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    handleResponse(res, securityModule.protect(req.file, req.body.password), req.file);
};

exports.unlock = (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    handleResponse(res, securityModule.unlock(req.file, req.body.password), req.file);
};

exports.rotate = (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const angle = parseInt(req.body.angle) || 90;
    handleResponse(res, editModule.rotate(req.file, angle), req.file);
};

exports.crop = (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const { x, y, width, height } = req.body;
    handleResponse(res, editModule.crop(req.file, { x, y, width, height }), req.file);
};

exports.watermark = (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    handleResponse(res, editModule.watermark(req.file, req.body.text), req.file);
};

exports.pageNumbers = (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    handleResponse(res, editModule.pageNumbers(req.file, req.body.position), req.file);
};

exports.imagesToPdf = (req, res) => {
    if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No images uploaded' });
    handleResponse(res, convertModule.imagesToPdf(req.files), req.files);
};

exports.sign = (req, res) => {
    if (!req.files || !req.files['file'] || !req.files['signature']) {
        return res.status(400).json({ error: 'Please upload both PDF and Signature image.' });
    }
    res.status(501).json({ error: 'Sign feature refactor pending' });
};

exports.compress = (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    handleResponse(res, compressModule.compress(req.file, req.body.level), req.file);
};

exports.repair = (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    handleResponse(res, repairModule.repair(req.file), req.file);
};

exports.ocr = (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    handleResponse(res, ocrModule.ocr(req.file, req.body.lang), req.file);
};

exports.officeToPdf = (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    handleResponse(res, officeModule.convertToPdf(req.file), req.file);
};

exports.pdfToWord = (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    handleResponse(res, officeModule.pdfToWord(req.file), req.file);
};

exports.summarize = async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    try {
        const result = await aiModule.summarize(req.file);
        await fileUtils.cleanupFiles([req.file.path]);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.startJob = (req, res) => {
    // Example of offloading a task to queue
    const jobId = queueModule.add('test-job', req.body);
    res.json({ jobId, message: 'Job started' });
};

exports.getJobStatus = (req, res) => {
    const job = queueModule.get(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
};
