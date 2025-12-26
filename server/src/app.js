const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: '*', // Allow all origins for local development
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for processed downloads
app.use('/downloads', express.static(path.join(__dirname, '../processed')));

// Basic Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
const pdfController = require('./controllers/pdfController');
const convertController = require('./controllers/convertController');
const upload = require('./middleware/upload');

const router = express.Router();

// PDF Tools
router.post('/merge', upload.array('files', 10), pdfController.merge);
router.post('/split', upload.single('file'), pdfController.split);
router.post('/img-to-pdf', upload.array('files', 20), pdfController.imagesToPdf);
router.post('/rotate', upload.single('file'), pdfController.rotate);
router.post('/protect', upload.single('file'), pdfController.protect);
router.post('/unlock', upload.single('file'), pdfController.unlock);
router.post('/watermark', upload.single('file'), pdfController.watermark);
router.post('/organize', upload.single('file'), pdfController.organize);
router.post('/page-numbers', upload.single('file'), pdfController.pageNumbers);
router.post('/crop', upload.single('file'), pdfController.crop);
router.post('/sign', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'signature', maxCount: 1 }]), pdfController.sign);
router.post('/compress', upload.single('file'), pdfController.compress);
router.post('/repair', upload.single('file'), pdfController.repair);
router.post('/ocr', upload.single('file'), pdfController.ocr);
router.post('/office-to-pdf', upload.single('file'), pdfController.officeToPdf);
router.post('/pdf-to-word', upload.single('file'), pdfController.pdfToWord);
router.post('/summarize', upload.single('file'), pdfController.summarize);
router.post('/jobs', pdfController.startJob);
router.get('/jobs/:id', pdfController.getJobStatus);

// Conversion Tools
router.post('/html-to-pdf', convertController.htmlToPdf);
router.post('/pdf-to-jpg', upload.single('file'), convertController.pdfToJpg);

app.use('/api/pdf', router);

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);

    // Ensure directories exist
    const dirs = ['../uploads', '../processed'];
    dirs.forEach(dir => {
        const fullPath = path.join(__dirname, dir);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }
    });
});
