const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;
const fileUtils = require('../utils/fileUtils');

exports.protect = async (file, password) => {
    const pdfBytes = await fs.readFile(file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    pdfDoc.encrypt({
        userPassword: password,
        ownerPassword: password,
        permissions: {
            printing: 'highResolution',
            modifying: false,
            copying: false,
        },
    });

    const fileName = `protected_${Date.now()}.pdf`;
    const filePath = fileUtils.getProcessedPath(fileName);

    const savedBytes = await pdfDoc.save();
    await fs.writeFile(filePath, savedBytes);

    return { fileName, filePath };
};

exports.unlock = async (file, password) => {
    const pdfBytes = await fs.readFile(file.path);
    // Attempt to load with password
    const pdfDoc = await PDFDocument.load(pdfBytes, { password });

    const fileName = `unlocked_${Date.now()}.pdf`;
    const filePath = fileUtils.getProcessedPath(fileName);

    // Saving without encrypt options removes security
    const savedBytes = await pdfDoc.save();
    await fs.writeFile(filePath, savedBytes);

    return { fileName, filePath };
};
