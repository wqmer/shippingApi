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
          console.log(args)
          callback(null, result);
         });
      });
}    

const getTracking = (requestArgs , callback) => {
  soap.createClient(path.join(__dirname, wsdl, 'TrackService_v18.wsdl'), function(err, client) {
    if(err)console.log(err)
      let args = extend(uility.FEDEXRequestAuth, uility.handleTrackingshipment(requestArgs))
      client.track(args,  function(err, result) {     
        if(err){
          console.log(err)
        } else {
          try{
            let originalInfo = result.CompletedTrackDetails[0].TrackDetails[0]
            let myresponse = {
                orderId : requestArgs.orderId,
                trackingNo : originalInfo.TrackingNumber,
                status : originalInfo.Notification.Severity,
                message : originalInfo.Notification.Message,
                data: originalInfo.StatusDetail
            }    
            callback(null, myresponse);
          }catch(error){
            callback(null, { "code": 500 , "message": "Fedex response error" });
          }
        }


        // myresponse.trackingNo = result.CompletedTrackDetails[0].TrackDetails[0].TrackingNumber
        // myresponse.status = result.CompletedTrackDetails[0].TrackDetails[0].Notification.Severity
        // myresponse.message = result.CompletedTrackDetails[0].TrackDetails[0].Notification.Message
        // myresponse.data = result.CompletedTrackDetails[0].TrackDetails[0].StatusDetail
        // console.log(args)
        // console.log(result)
        // delete result.Version
   
       });
    });
}  



module.exports = { 
                  addressValidation, 
                  processShipment,
                  getRates,
                  getTracking
                  // AddOrderMainToConfirm  
}