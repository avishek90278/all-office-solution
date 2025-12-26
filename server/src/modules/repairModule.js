const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);
const fileUtils = require('../utils/fileUtils');

exports.repair = async (file) => {
    const fileName = `repaired_${Date.now()}.pdf`;
    const filePath = fileUtils.getProcessedPath(fileName);

    // Ghostscript can often repair PDFs by rewriting them
    const cmd = `gswin64c -o "${filePath}" -sDEVICE=pdfwrite -dPDFSETTINGS=/prepress "${file.path}"`;

    try {
        await execAsync(cmd);
        return { fileName, filePath };
    } catch (error) {
        console.error('Repair failed:', error);
        throw new Error('Repair failed. The file might be too corrupted.');
    }
};
