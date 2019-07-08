const soap = require('soap');
const config = require('../config')
const path = require('path')
const uility = require ('./uility')
const extend = require('extend')


const BuyPostage = (requestArgs , callback) => {
    soap.createClient(config.usps_endicia.wsdl_url, function(err, client) {
    if(err)console.log(err)
    let args = extend(uility.endicia_auth, uility.handleBuyPostageRequest(requestArgs))
    // console.log(order)
    client.BuyPostage(args,  function(err, result) {
      // console.log(extend(uility.endicia_auth.LabelRequest, uility.handleShipRequest(requestArgs)).LabelRequest)
        callback(null, result);
    });
}); 
}   


const GetPostageLabel = (requestArgs , callback) => {
      soap.createClient(config.usps_endicia.wsdl_url, function(err, client) {
      // soap.createClient(config.fedex.Reqeuest_url, function(err, client) {
      // if(err)console.log(err)
      // console.log(client)
      if(err)console.log(err)
      let args = extend(uility.endicia_auth, uility.handleShipRequest(requestArgs))
      let order = {  LabelRequest:undefined  }
      order.LabelRequest = args
      // console.log(order)
      client.GetPostageLabel(order,  function(err, result) {
        // console.log(extend(uility.endicia_auth.LabelRequest, uility.handleShipRequest(requestArgs)).LabelRequest)
          callback(null, result);
      });
  }); 
}       




module.exports = { 
    GetPostageLabel,
    BuyPostage
    // AddOrderMainToConfirm  
}