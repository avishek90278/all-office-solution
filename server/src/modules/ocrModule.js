const Tesseract = require('tesseract.js');
const fileUtils = require('../utils/fileUtils');
const fs = require('fs').promises;
const path = require('path');
const { PDFDocument } = require('pdf-lib');
// const pdfImgConvert = require('pdf-img-convert'); // Disabled due to issues

exports.ocr = async (file, lang = 'eng') => {
    // 1. Convert PDF to Images (Requires working pdf-img-convert or similar)
    // Since we disabled pdf-img-convert due to canvas issues, we can't easily do PDF->Image->OCR right now without it.
    // However, Tesseract.js can take images.
    // If the input is an image, we can OCR it directly.
    // If it's a PDF, we need to convert it.

    // For now, let's support Image -> PDF with Text (OCR)
    // Or if we fix pdf-img-convert, we can do PDF -> OCR.

    if (file.mimetype === 'application/pdf') {
        throw new Error('OCR for PDF files is currently disabled due to missing image conversion dependencies.');
    }

    const fileName = `ocr_${Date.now()}.pdf`;
    const filePath = fileUtils.getProcessedPath(fileName);

    const { data: { text, pdf } } = await Tesseract.recognize(file.path, lang, {
        logger: m => console.log(m)
    });

    // Tesseract.js can output PDF directly if configured, but recognize returns text.
    // To get a PDF with text layer, we need to use `recognize` with `pdf` output options or construct it.
    // Tesseract.js has a `pdf` output format.

    // Simplified: Just return text for now or create a PDF with the text.
    // The user wants "OCR PDF".

    // Let's try to create a simple PDF with the text.
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    page.drawText(text, { x: 50, y: 700, size: 12 });

    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(filePath, pdfBytes);

    return { fileName, filePath };
};
