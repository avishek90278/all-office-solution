const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');
const fileUtils = require('../utils/fileUtils');

exports.process = async (file, rangeStr) => {
    const pdfBytes = await fs.readFile(file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const totalPages = pdfDoc.getPageCount();

    const newPdf = await PDFDocument.create();
    const pagesToKeep = new Set();

    const ranges = rangeStr.split(',');
    for (const range of ranges) {
        if (range.includes('-')) {
            const [start, end] = range.split('-').map(Number);
            for (let i = start; i <= end; i++) {
                if (i >= 1 && i <= totalPages) pagesToKeep.add(i - 1);
            }
        } else {
            const page = Number(range);
            if (page >= 1 && page <= totalPages) pagesToKeep.add(page - 1);
        }
    }

    const sortedIndices = Array.from(pagesToKeep).sort((a, b) => a - b);
    const copiedPages = await newPdf.copyPages(pdfDoc, sortedIndices);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const fileName = `split_${Date.now()}.pdf`;
    const filePath = fileUtils.getProcessedPath(fileName);

    const savedBytes = await newPdf.save();
    await fs.writeFile(filePath, savedBytes);

    return { fileName, filePath };
};
