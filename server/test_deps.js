try { require('pdf-lib'); console.log('pdf-lib ok'); } catch (e) { console.error('pdf-lib fail', e); }
try { require('puppeteer'); console.log('puppeteer ok'); } catch (e) { console.error('puppeteer fail', e); }
try { require('tesseract.js'); console.log('tesseract ok'); } catch (e) { console.error('tesseract fail', e); }
try { require('./src/utils/fileUtils'); console.log('fileUtils ok'); } catch (e) { console.error('fileUtils fail', e); }
