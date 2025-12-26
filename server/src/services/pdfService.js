const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

class PdfService {
    constructor() {
        this.processedDir = path.join(__dirname, '../../processed');
    }

    async _savePdf(pdfDoc, originalName, suffix) {
        const pdfBytes = await pdfDoc.save();
        const fileName = `${path.parse(originalName).name}_${suffix}_${Date.now()}.pdf`;
        const filePath = path.join(this.processedDir, fileName);

        await fs.mkdir(this.processedDir, { recursive: true });
        await fs.writeFile(filePath, pdfBytes);

        return { fileName, filePath };
    }

    async mergePdfs(filePaths) {
        const mergedPdf = await PDFDocument.create();

        for (const filePath of filePaths) {
            const pdfBytes = await fs.readFile(filePath);
            const pdf = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        return await this._savePdf(mergedPdf, 'merged', 'result');
    }

    async splitPdf(filePath, rangeStr) {
        // rangeStr format: "1-3,5,7-9" (1-based index)
        const pdfBytes = await fs.readFile(filePath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const totalPages = pdfDoc.getPageCount();

        const newPdf = await PDFDocument.create();
        const pagesToKeep = new Set();

        const ranges = rangeStr.split(',');
        for (const range of ranges) {
            if (range.includes('-')) {
                const [start, end] = range.split('-').map(Number);
                for (let i = start; i <= end; i++) {
                    if (i >= 1 && i <= totalPages) pagesToKeep.add(i - 1); // Convert to 0-based
                }
            } else {
                const page = Number(range);
                if (page >= 1 && page <= totalPages) pagesToKeep.add(page - 1);
            }
        }

        const sortedIndices = Array.from(pagesToKeep).sort((a, b) => a - b);
        const copiedPages = await newPdf.copyPages(pdfDoc, sortedIndices);
        copiedPages.forEach((page) => newPdf.addPage(page));

        return await this._savePdf(newPdf, path.basename(filePath), 'split');
    }

    async imagesToPdf(imagePaths) {
        const pdfDoc = await PDFDocument.create();

        for (const imgPath of imagePaths) {
            const imgBytes = await fs.readFile(imgPath);
            const ext = path.extname(imgPath).toLowerCase();
            let image;

            if (ext === '.jpg' || ext === '.jpeg') {
                image = await pdfDoc.embedJpg(imgBytes);
            } else if (ext === '.png') {
                image = await pdfDoc.embedPng(imgBytes);
            } else {
                continue; // Skip unsupported
            }

            const page = pdfDoc.addPage([image.width, image.height]);
            page.drawImage(image, {
                x: 0,
                y: 0,
                width: image.width,
                height: image.height,
            });
        }

        return await this._savePdf(pdfDoc, 'images', 'converted');
    }

    async rotatePdf(filePath, angle) {
        // angle should be 90, 180, 270
        const pdfBytes = await fs.readFile(filePath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = pdfDoc.getPages();

        pages.forEach(page => {
            const currentRotation = page.getRotation().angle;
            page.setRotation(currentRotation + angle);
        });

        return await this._savePdf(pdfDoc, path.basename(filePath), 'rotated');
    }

    async protectPdf(filePath, password) {
        const pdfBytes = await fs.readFile(filePath);
        const pdfDoc = await PDFDocument.load(pdfBytes);

        // Encrypt with user password (owner password same for simplicity here)
        pdfDoc.encrypt({
            userPassword: password,
            ownerPassword: password,
            permissions: {
                printing: 'highResolution',
                modifying: false,
                copying: false,
                annotating: false,
                fillingForms: false,
                contentAccessibility: false,
                documentAssembly: false,
            },
        });

        return await this._savePdf(pdfDoc, path.basename(filePath), 'protected');
    }

    async unlockPdf(filePath, password) {
        // pdf-lib requires the password to load an encrypted PDF
        // If the password is wrong, it will throw an error, which we catch in controller
        const pdfBytes = await fs.readFile(filePath);

        // Try to load with password. If it's not encrypted, it might ignore password or load fine.
        // If encrypted and password wrong -> throws.
        const pdfDoc = await PDFDocument.load(pdfBytes, { password });

        // To "remove" password, we just save it without encryption?
        // pdf-lib doesn't have a direct "decrypt" method, but saving a loaded doc 
        // usually saves it unencrypted unless encrypt() is called.
        // However, we need to make sure we don't re-encrypt.

        return await this._savePdf(pdfDoc, path.basename(filePath), 'unlocked');
    }

    async watermarkPdf(filePath, watermarkText) {
        const pdfBytes = await fs.readFile(filePath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = pdfDoc.getPages();
        const { degrees, rgb } = require('pdf-lib'); // Import locally if needed or at top

        for (const page of pages) {
            const { width, height } = page.getSize();
            page.drawText(watermarkText, {
                x: width / 2 - (watermarkText.length * 10), // Rough centering
                y: height / 2,
                size: 50,
                color: rgb(0.7, 0.7, 0.7), // Light gray
                rotate: degrees(45),
                opacity: 0.5,
            });
        }

        return await this._savePdf(pdfDoc, path.basename(filePath), 'watermarked');
    }

    async organizePdf(filePath, pageIndices) {
        // pageIndices: Array of numbers representing 0-based page indices to keep in order
        const pdfBytes = await fs.readFile(filePath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const newPdf = await PDFDocument.create();

        const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
        copiedPages.forEach(page => newPdf.addPage(page));

        return await this._savePdf(newPdf, path.basename(filePath), 'organized');
    }

    async addPageNumbers(filePath, position = 'bottom-center') {
        const pdfBytes = await fs.readFile(filePath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = pdfDoc.getPages();
        const { rgb } = require('pdf-lib');

        const totalPages = pages.length;

        pages.forEach((page, idx) => {
            const { width, height } = page.getSize();
            const text = `Page ${idx + 1} of ${totalPages}`;
            const fontSize = 12;
            const textWidth = fontSize * text.length * 0.5; // Approx

            let x, y;
            // Simple positioning logic
            if (position === 'bottom-center') {
                x = (width - textWidth) / 2;
                y = 20;
            } else if (position === 'bottom-right') {
                x = width - textWidth - 20;
                y = 20;
            } else {
                // Default bottom center
                x = (width - textWidth) / 2;
                y = 20;
            }

            page.drawText(text, {
                x,
                y,
                size: fontSize,
                color: rgb(0, 0, 0),
            });
        });

        return await this._savePdf(pdfDoc, path.basename(filePath), 'numbered');
    }

    async cropPdf(filePath, cropData) {
        // cropData: { x, y, width, height } (percentages or points? Let's assume points for now, or handle % in frontend)
        // For simplicity, let's assume we crop all pages to the same box
        const pdfBytes = await fs.readFile(filePath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = pdfDoc.getPages();

        pages.forEach(page => {
            // cropData comes in as { x, y, width, height }
            // We need to validate against page size
            const { width: pageWidth, height: pageHeight } = page.getSize();

            // If inputs are percentages (0-100), convert to points
            const x = (cropData.x / 100) * pageWidth;
            const y = (cropData.y / 100) * pageHeight;
            const w = (cropData.width / 100) * pageWidth;
            const h = (cropData.height / 100) * pageHeight;

            page.setCropBox(x, y, w, h);
        });

        return await this._savePdf(pdfDoc, path.basename(filePath), 'cropped');
    }

    async signPdf(filePath, signatureImagePath, options = {}) {
        const pdfBytes = await fs.readFile(filePath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = pdfDoc.getPages();

        const imgBytes = await fs.readFile(signatureImagePath);
        const ext = path.extname(signatureImagePath).toLowerCase();
        let signatureImage;

        if (ext === '.png') {
            signatureImage = await pdfDoc.embedPng(imgBytes);
        } else if (ext === '.jpg' || ext === '.jpeg') {
            signatureImage = await pdfDoc.embedJpg(imgBytes);
        } else {
            throw new Error('Unsupported signature format');
        }

        // Default to last page if not specified
        const pageIndex = options.pageIndex !== undefined ? options.pageIndex : pages.length - 1;
        const page = pages[pageIndex];

        const { width, height } = page.getSize();
        const sigDims = signatureImage.scale(0.5); // Scale down a bit

        page.drawImage(signatureImage, {
            x: options.x || (width / 2) - (sigDims.width / 2),
            y: options.y || 100,
            width: sigDims.width,
            height: sigDims.height,
        });

        return await this._savePdf(pdfDoc, path.basename(filePath), 'signed');
    }



}

module.exports = new PdfService();
