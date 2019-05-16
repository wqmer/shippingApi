const soap = require('soap');
const config = require('../config')
const path = require('path')
const uility = require ('./uility')
const extend = require('extend')

const wsdl = process.env.NODE_ENV == 'test' ? 'wsdl/test':'wsdl/production'

const addressValidation = (requestArgs , callback) => {
      soap.createClient(path.join(__dirname, wsdl, 'AddressValidationService_v4.wsdl'), function(err, client) {
        // soap.createClient(config.fedex.Reqeuest_url, function(err, client) {
        // if(err)console.log(err)
        // console.log(client)
        if(err)console.log(err)
        client.addressValidation(requestArgs,  function(err, result) {
            console.log(requestArgs)
            callback(null, result);
        });
    }); 
}       

const processShipment = (requestArgs , callback) => {
      soap.createClient(path.join(__dirname, wsdl, 'ShipService_v23.wsdl') ,function(err, client) {
      if(err)console.log(err)
      client.processShipment(extend(uility.FEDEXRequestAuth, uility.handleShipRequest(requestArgs)),  function(err, result) {
          callback(null, result);
      });
  });
}   

const getRates = (requestArgs , callback) => {
    soap.createClient(path.join(__dirname, wsdl, 'RateService_v24.wsdl'), function(err, client) {
    if(err)console.log(err)
    let args = extend(uility.FEDEXRequestAuth, uility.handleRateRequest(requestArgs))
    client.getRates(args,  function(err, result) {
        // console.log(args)
        callback(null, result);
    });
});
}    



module.exports = { 
                  addressValidation, 
                  processShipment,
                  getRates
                  // AddOrderMainToConfirm  
}