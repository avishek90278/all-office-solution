try {
    require('./src/modules/aiModule');
    console.log('aiModule loaded');
} catch (e) {
    console.error('aiModule fail', e);
}
