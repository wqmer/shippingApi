const soap = require('soap');
const config = require('./config')

const GetChannelList = (requestArgs , callback) => {
    soap.createClient(config.LosAPIservice_URL, function(err, client) {
         if(err)console.log(err)
         client.GetChannelList( requestArgs,function(err, result) {
            callback(null, JSON.stringify(result));
        });
    });
}

const AddOrderMainToConfirm = ( requestArgs , callback) => {
    soap.createClient(config.LosAPIservice_URL, function(err, client) {
         if(err)console.log(err)
         client.AddOrderMainToConfirm( requestArgs, function(err, result) {
            callback(null, JSON.stringify(result));
            // callback(null, result);
        });
    });
}









module.exports = {GetChannelList , AddOrderMainToConfirm  }


