const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

const dependencies = {
    ghostscript: { cmd: 'gswin64c --version', name: 'Ghostscript' }, // Windows specific command
    tesseract: { cmd: 'tesseract --version', name: 'Tesseract OCR' },
    libreoffice: { cmd: 'soffice --version', name: 'LibreOffice' },
    magick: { cmd: 'magick --version', name: 'ImageMagick' }
};

exports.checkSystemDependencies = async () => {
    const results = {};

    for (const [key, dep] of Object.entries(dependencies)) {
        try {
            await execAsync(dep.cmd);
            results[key] = true;
            console.log(`[System Check] ${dep.name}: INSTALLED`);
        } catch (error) {
            results[key] = false;
            console.warn(`[System Check] ${dep.name}: MISSING (Some features will be disabled)`);
        }
    }

    return results;
};
