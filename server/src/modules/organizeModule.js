const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;
const fileUtils = require('../utils/fileUtils');

exports.process = async (file, pageIndices) => {
    const pdfBytes = await fs.readFile(file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const newPdf = await PDFDocument.create();

    const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach(page => newPdf.addPage(page));

    const fileName = `organized_${Date.now()}.pdf`;
    const filePath = fileUtils.getProcessedPath(fileName);

    const savedBytes = await newPdf.save();
    await fs.writeFile(filePath, savedBytes);

    return { fileName, filePath };
};
