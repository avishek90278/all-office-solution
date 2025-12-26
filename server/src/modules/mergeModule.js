const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');
const fileUtils = require('../utils/fileUtils');

exports.process = async (files) => {
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
        const pdfBytes = await fs.readFile(file.path);
        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const fileName = `merged_${Date.now()}.pdf`;
    const filePath = fileUtils.getProcessedPath(fileName);

    const pdfBytes = await mergedPdf.save();
    await fs.writeFile(filePath, pdfBytes);

    return { fileName, filePath };
};
