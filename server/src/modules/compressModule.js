const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);
const fileUtils = require('../utils/fileUtils');
const path = require('path');
const fs = require('fs').promises;

exports.compress = async (file, level = 'ebook') => {
    // Ghostscript compression levels:
    // screen: 72dpi (lowest)
    // ebook: 150dpi (medium)
    // printer: 300dpi (high)
    // prepress: 300dpi (color preserving)

    const settings = {
        screen: '/screen',
        ebook: '/ebook',
        printer: '/printer',
        prepress: '/prepress',
        default: '/default'
    };

    const pdfSettings = settings[level] || settings.ebook;
    const fileName = `compressed_${Date.now()}.pdf`;
    const filePath = fileUtils.getProcessedPath(fileName);

    // Windows Ghostscript command (gswin64c)
    // Ensure Ghostscript is in PATH
    const cmd = `gswin64c -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=${pdfSettings} -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${filePath}" "${file.path}"`;

    try {
        await execAsync(cmd);
        return { fileName, filePath };
    } catch (error) {
        console.error('Ghostscript compression failed:', error);
        throw new Error('Compression failed. Is Ghostscript installed?');
    }
};
