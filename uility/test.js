const apitest = require('./api');

apitest.detectCarrier('123').then(result => console.log(result)).catch(err => console.log(err))