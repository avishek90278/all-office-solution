const convertModule = require('./src/modules/convertModule');
const path = require('path');

async function test() {
    try {
        console.log('Starting test...');
        const imgPath = path.join(__dirname, 'test.png');
        console.log('Image path:', imgPath);

        const result = await convertModule.imagesToPdf([{ path: imgPath, originalname: 'test.png' }]);
        console.log('Success:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
