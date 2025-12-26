const convertModule = require('../modules/convertModule');
const fs = require('fs').promises;
const fileUtils = require('../utils/fileUtils');

exports.htmlToPdf = async (req, res) => {
    try {
        const { url, html } = req.body;
        if (!url && !html) return res.status(400).json({ error: 'URL or HTML content is required.' });

        const result = await convertModule.htmlToPdf(url || html, url ? 'url' : 'html');
        res.json({ message: 'Converted to PDF', downloadUrl: `/downloads/${result.fileName}` });
    } catch (error) {
        console.error('HTML to PDF error:', error);
        res.status(500).json({ error: 'Failed to convert HTML to PDF' });
    }
};

exports.pdfToJpg = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'Please upload a PDF.' });

        const result = await convertModule.pdfToJpg(req.file);
        await fs.unlink(req.file.path).catch(console.error);

        res.json({
            message: 'Converted to JPG',
            downloadUrl: `/downloads/${result.fileName}`,
            allFiles: result.allFiles
        });
    } catch (error) {
        console.error('PDF to JPG error:', error);
        res.status(500).json({ error: error.message || 'Failed to convert PDF to JPG' });
    }
};
