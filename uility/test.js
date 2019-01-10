const apitest = require('./api');

apitest.detectCarrier('080049313570').then(result => console.log(result)).catch(err => console.log(err))
