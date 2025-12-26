const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');
const puppeteer = require('puppeteer');
const fileUtils = require('../utils/fileUtils');

exports.imagesToPdf = async (files) => {
    const pdfDoc = await PDFDocument.create();

    for (const file of files) {
        const imgBytes = await fs.readFile(file.path);
        const ext = path.extname(file.originalname).toLowerCase();
        let image;

        if (ext === '.jpg' || ext === '.jpeg') {
            image = await pdfDoc.embedJpg(imgBytes);
        } else if (ext === '.png') {
            image = await pdfDoc.embedPng(imgBytes);
        } else {
            continue;
        }

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    }

    const fileName = `images_converted_${Date.now()}.pdf`;
    const filePath = fileUtils.getProcessedPath(fileName);
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(filePath, pdfBytes);

    return { fileName, filePath };
};

exports.htmlToPdf = async (input, type = 'url') => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    if (type === 'url') {
        await page.goto(input, { waitUntil: 'networkidle0' });
    } else {
        await page.setContent(input, { waitUntil: 'networkidle0' });
    }

    const fileName = `html_converted_${Date.now()}.pdf`;
    const filePath = fileUtils.getProcessedPath(fileName);

    await page.pdf({ path: filePath, format: 'A4' });
    await browser.close();

    return { fileName, filePath };
};

exports.pdfToJpg = async (file) => {
    throw new Error('PDF to JPG is temporarily disabled due to missing dependencies on this system.');
    // const pdfImgConvert = require('pdf-img-convert');
    // const outputImages = await pdfImgConvert.convert(file.path);
    const savedFiles = [];
    const baseName = path.parse(file.originalname).name;

    for (let i = 0; i < outputImages.length; i++) {
        const fileName = `${baseName}_page_${i + 1}.jpg`;
        const outPath = fileUtils.getProcessedPath(fileName);
        await fs.writeFile(outPath, outputImages[i]);
        savedFiles.push(fileName);
    }

    // Return first file for now, typically would zip
    return { fileName: savedFiles[0], allFiles: savedFiles };
};
