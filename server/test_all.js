try {
    require('./src/modules/mergeModule'); console.log('merge ok');
    require('./src/modules/splitModule'); console.log('split ok');
    require('./src/modules/organizeModule'); console.log('organize ok');
    require('./src/modules/securityModule'); console.log('security ok');
    require('./src/modules/editModule'); console.log('edit ok');
    require('./src/modules/convertModule'); console.log('convert ok');
    require('./src/modules/compressModule'); console.log('compress ok');
    require('./src/modules/repairModule'); console.log('repair ok');
    require('./src/modules/ocrModule'); console.log('ocr ok');
    require('./src/modules/officeModule'); console.log('office ok');
    require('./src/modules/aiModule'); console.log('ai ok');
    require('./src/modules/queueModule'); console.log('queue ok');
    const pc = require('./src/controllers/pdfController');
    console.log('controller keys:', Object.keys(pc));
} catch (e) {
    console.error('FAIL:', e);
}
