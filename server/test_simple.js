try {
    console.log('Requiring fileUtils...');
    require('./src/utils/fileUtils');
    console.log('fileUtils loaded.');

    console.log('Requiring convertModule...');
    require('./src/modules/convertModule');
    console.log('convertModule loaded.');
} catch (e) {
    console.error('FAIL:', e);
}
