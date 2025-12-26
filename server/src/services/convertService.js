const puppeteer = require('puppeteer');
const pdfImgConvert = require('pdf-img-convert');
const fs = require('fs').promises;
const path = require('path');
const { PDFDocument } = require('pdf-lib');

class ConvertService {
    constructor() {
        this.processedDir = path.join(__dirname, '../../processed');
    }

    async htmlToPdf(input, type = 'url') {
        // input: URL string or HTML string
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();

        if (type === 'url') {
            await page.goto(input, { waitUntil: 'networkidle0' });
        } else {
            await page.setContent(input, { waitUntil: 'networkidle0' });
        }

        const fileName = `html_converted_${Date.now()}.pdf`;
        const filePath = path.join(this.processedDir, fileName);

        await fs.mkdir(this.processedDir, { recursive: true });
        await page.pdf({ path: filePath, format: 'A4' });

        await browser.close();
        return { fileName, filePath };
    }

    async pdfToJpg(filePath) {
        // Returns array of image buffers
        const outputImages = await pdfImgConvert.convert(filePath);

        // Save images to disk (zip them if multiple? for now just return paths or zip)
        // For simplicity in this demo, if multiple pages, we zip them. If one, we return jpg.
        // Actually, let's just save the first page as preview or all pages.
        // Let's save all pages and zip them if > 1.

        const baseName = path.parse(filePath).name;
        const savedFiles = [];

        for (let i = 0; i < outputImages.length; i++) {
            const fileName = `${baseName}_page_${i + 1}.jpg`;
            const outPath = path.join(this.processedDir, fileName);
            await fs.writeFile(outPath, outputImages[i]);
            savedFiles.push(fileName);
        }

        // TODO: Implement Zipping. For now, just return the first one or list.
        // We'll return the first one for the demo to keep it simple, or a specific one.
        return { fileName: savedFiles[0], allFiles: savedFiles };
    }
}

module.exports = new ConvertService();
