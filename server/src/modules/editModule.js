const { PDFDocument, rgb, degrees } = require('pdf-lib');
const fs = require('fs').promises;
const fileUtils = require('../utils/fileUtils');

exports.rotate = async (file, angle) => {
    const pdfBytes = await fs.readFile(file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    pages.forEach(page => {
        const currentRotation = page.getRotation().angle;
        page.setRotation(currentRotation + angle);
    });

    return await save(pdfDoc, 'rotated');
};

exports.crop = async (file, { x, y, width, height }) => {
    const pdfBytes = await fs.readFile(file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    pages.forEach(page => {
        const { width: pageWidth, height: pageHeight } = page.getSize();
        // Convert percentages to points if needed, assuming inputs are % for now
        const cropX = (x / 100) * pageWidth;
        const cropY = (y / 100) * pageHeight;
        const cropW = (width / 100) * pageWidth;
        const cropH = (height / 100) * pageHeight;

        page.setCropBox(cropX, cropY, cropW, cropH);
    });

    return await save(pdfDoc, 'cropped');
};

exports.watermark = async (file, text) => {
    const pdfBytes = await fs.readFile(file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    pages.forEach(page => {
        const { width, height } = page.getSize();
        page.drawText(text, {
            x: width / 2 - (text.length * 10),
            y: height / 2,
            size: 50,
            color: rgb(0.7, 0.7, 0.7),
            rotate: degrees(45),
            opacity: 0.5,
        });
    });

    return await save(pdfDoc, 'watermarked');
};

exports.pageNumbers = async (file, position) => {
    const pdfBytes = await fs.readFile(file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const totalPages = pages.length;

    pages.forEach((page, idx) => {
        const { width } = page.getSize();
        const text = `Page ${idx + 1} of ${totalPages}`;
        const fontSize = 12;
        const textWidth = fontSize * text.length * 0.5;

        let x = (width - textWidth) / 2;
        let y = 20;

        page.drawText(text, { x, y, size: fontSize, color: rgb(0, 0, 0) });
    });

    return await save(pdfDoc, 'numbered');
};

exports.modifyPdf = async (file, operations) => {
    // operations: Array of { type: 'text'|'image', page: 0, x, y, content, options }
    const pdfDoc = await PDFDocument.load(await fs.readFile(file.path));
    const pages = pdfDoc.getPages();

    for (const op of operations) {
        const page = pages[op.page || 0];
        const { height } = page.getSize();

        if (op.type === 'text') {
            // op.content = text, op.options = { size, color, font }
            // Simple text support
            page.drawText(op.content, {
                x: op.x,
                y: height - op.y, // PDF coords are bottom-left, UI usually top-left
                size: op.options?.size || 12,
                // color: ... (requires color parsing, skipping for brevity)
            });
        } else if (op.type === 'image') {
            // op.content = base64 or path? Assuming path for now if uploaded, or base64.
            // If it's a file upload, we need to handle it.
            // For simplicity, let's assume we handle this in the controller to map uploads to ops.
        }
    }

    const fileName = `edited_${Date.now()}.pdf`;
    const filePath = fileUtils.getProcessedPath(fileName);
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(filePath, pdfBytes);

    return { fileName, filePath };
};

async function save(pdfDoc, suffix) {
    const fileName = `${suffix}_${Date.now()}.pdf`;
    const filePath = fileUtils.getProcessedPath(fileName);
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(filePath, pdfBytes);
    return { fileName, filePath };
}
