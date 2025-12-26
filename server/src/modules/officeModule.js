const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);
const fileUtils = require('../utils/fileUtils');
const path = require('path');
const fs = require('fs').promises;

exports.convertToPdf = async (file) => {
    // Supported formats: .docx, .doc, .xlsx, .xls, .pptx, .ppt
    const outputDir = path.dirname(file.path);
    const fileName = path.parse(file.originalname).name + '.pdf';
    // LibreOffice saves with the same name as input but .pdf extension in the outdir
    // We need to predict the output path.
    // However, multer saves files with random names (e.g. "123456-789.docx").
    // LibreOffice will convert "123456-789.docx" to "123456-789.pdf".

    // Command: soffice --headless --convert-to pdf --outdir <dir> <file>
    // On Windows, it might be 'soffice' or full path. We assume 'soffice' is in PATH or 'scalc' etc.
    // Usually 'soffice' works if installed correctly.

    const cmd = `soffice --headless --convert-to pdf --outdir "${outputDir}" "${file.path}"`;

    try {
        await execAsync(cmd);

        // The output file will be at outputDir/filename_without_ext.pdf
        const inputBase = path.parse(file.path).name;
        const generatedPdfPath = path.join(outputDir, inputBase + '.pdf');

        // We want to move/rename it to our processed folder with a nice name?
        // Actually, fileUtils.getProcessedPath is better.
        // Let's move it to processed folder.

        const finalFileName = `office_converted_${Date.now()}.pdf`;
        const finalPath = fileUtils.getProcessedPath(finalFileName);

        await fs.rename(generatedPdfPath, finalPath);

        return { fileName: finalFileName, filePath: finalPath };
    } catch (error) {
        console.error('LibreOffice conversion failed:', error);
        throw new Error('Conversion failed. Ensure LibreOffice is installed and in your system PATH.');
    }
};

exports.pdfToWord = async (file) => {
    // LibreOffice can convert PDF to Word (.docx)
    // Command: soffice --headless --infilter="writer_pdf_import" --convert-to docx --outdir <dir> <file>

    const outputDir = path.dirname(file.path);
    const cmd = `soffice --headless --infilter="writer_pdf_import" --convert-to docx --outdir "${outputDir}" "${file.path}"`;

    try {
        await execAsync(cmd);

        const inputBase = path.parse(file.path).name;
        const generatedDocPath = path.join(outputDir, inputBase + '.docx');

        const finalFileName = `pdf_to_word_${Date.now()}.docx`;
        const finalPath = fileUtils.getProcessedPath(finalFileName);

        await fs.rename(generatedDocPath, finalPath);

        return { fileName: finalFileName, filePath: finalPath };
    } catch (error) {
        console.error('LibreOffice PDF to Word failed:', error);
        throw new Error('Conversion failed. Ensure LibreOffice is installed.');
    }
};
