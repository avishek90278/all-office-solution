const sc = require('./src/utils/systemCheck');
sc.checkSystemDependencies().then(console.log).catch(console.error);
