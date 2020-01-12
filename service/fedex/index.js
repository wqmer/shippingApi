const soap = require('soap');
const config = require('../config')
const path = require('path')
const uility = require('./uility')
const extend = require('extend')

let wsdl = process.env.NODE_ENV == 'test' ? 'wsdl/test' : 'wsdl/production'
// const wsdl = 'wsdl/test'
// const wsdl = process.env.NODE_ENV == 'test' ? 'wsdl/production':'wsdl/production'

//use test environment only
const addressValidation = (requestArgs, callback) => {
  soap.createClient(path.join(__dirname, 'wsdl/test', 'AddressValidationService_v4.wsdl'), function (err, client) {
    if (err) console.log(err)
    client.addressValidation(uility.handleAddressValidate(requestArgs), function (err, result) {
      callback(null, result);
    });
  });
}

const isResidential = (requestArgs, callback) => {
  soap.createClient(path.join(__dirname, 'wsdl/test', 'AddressValidationService_v4.wsdl'), function (err, client) {
    if (err) console.log(err)
    client.addressValidation(uility.handleAddressValidate(requestArgs), function (err, result) {
      let myresponse = {
        status: 'success',
      }
      try {
        myresponse.addressType = result.AddressResults[0].Classification
        callback(null, myresponse);
      } catch (error) {
        callback(null, {
          "code": 500,
          "message": "Fedex response error"
        });
      }
    });
  });
}

const processShipment = (requestArgs, callback) => {
  soap.createClient(path.join(__dirname, wsdl, 'ShipService_v23.wsdl'), function (err, client) {
    if (err) console.log(err)
    let args = {}
    extend(args, uility.FEDEXRequestAuth, uility.handleShipRequest(requestArgs))
    // console.log(uility.FEDEXRequestAuth)
    client.processShipment(args, function (err, result) {
      // console.log(args)
      callback(null, result);
    });
  });
}

const getRates = (requestArgs, callback) => {
  soap.createClient(path.join(__dirname, wsdl, 'RateService_v24.wsdl'), function (err, client) {
    if (err) console.log(err)
    let args = {}
    extend(args, uility.FEDEXRequestAuth, uility.handleRateRequest(requestArgs))
    client.getRates(args, function (err, result) {
      callback(null, { referenceNumber: requestArgs.referenceNumber, result });
    });
  });
}

const getZone = (requestArgs, callback) => {
  soap.createClient(path.join(__dirname, 'wsdl/test', 'RateService_v24.wsdl'), function (err, client) {
    if (err) console.log(err)
    let args = {}
    extend(args, uility.FEDEXRequestTestAuth, uility.handleRateTestRequest(requestArgs))
    client.getRates(args, function (err, result) {
      let myrespone = {
        "referenceNumber": requestArgs.referenceNumber,
        "success": false,
      }
      if (result.HighestSeverity == "ERROR") {
        myrespone.description = result.Notifications[0].Message
        callback(null, myrespone)
      } else {
        myrespone.success = true
        myrespone.zone = result.RateReplyDetails[0].RatedShipmentDetails[0].ShipmentRateDetail.RateZone
        callback(null, myrespone);
      }
    });
  });
}

const getTracking = (requestArgs, callback) => {
  console.log(requestArgs)
  soap.createClient(path.join(__dirname, wsdl, 'TrackService_v18.wsdl'), function (err, client) {
    if (err) console.log(err)
    let args = {}
    extend(args, uility.FEDEXRequestAuth, uility.handleTrackingshipment(requestArgs))
    client.track(args, function (err, result) {

      if (err) {
        console.log(err)
      } else {

        try {

          let originalInfo = result.CompletedTrackDetails[0].TrackDetails[0]
          let myresponse = {
            orderId: requestArgs.orderId,
            trackingNo: originalInfo.TrackingNumber,
            status: originalInfo.Notification.Severity,
            message: originalInfo.Notification.Message,
            data: originalInfo.Events
          }
          // callback(null, result);
          callback(null, myresponse);
        } catch (error) {
          // console.log(error)
          callback(null, {
            "code": 500,
            "message": "Fedex response error"
          });
        }
      }
    });
  });
}

const getFuelSurcharge = (requestArgs, callback) => {
  let opt = {
    "shipMethod": requestArgs.method,
    "Fname": "Ye Zhang",
    "Fcompany": "KYL Trade Inc",
    "Ftel": "2155880271",
    "Fadd1": "2777 alton Parkway",
    "Fadd2": "Apt 347",
    "Fcity": "Irvine",
    "Fstate": "CA",
    "Fpostcode": "92606",
    "Fcountry": "us",
    "Sname": "kimi",
    "Scompany": "chukkoula",
    "Stel": "2155880271",
    "Sadd1": "2777 alton Parkway",
    "Sadd2": "Apt 347",
    "Scity": "Irvine",
    "Sstate": "CA",
    "Spostcode": "92606",
    "Scountry": "us",
    "OrderID": "myorderID",
    "SKU": "123",
    "Weight": "17",
    "Define1": "sku"
  }

  soap.createClient(path.join(__dirname, wsdl, 'RateService_v24.wsdl'), function (err, client) {
    // console.log(123)
    if (err) console.log(err)
    let args = {}
    extend(args, uility.FEDEXRequestAuth, uility.handleRateRequest(opt))
    client.getRates(args, function (err, result) {
      // console.log(args)
      let myresponse = {
        Status: 'success',
        Source: 'default',
        data: {}
      }
      try {

        let fuelcharge = result.RateReplyDetails[0].RatedShipmentDetails[0].ShipmentRateDetail.FuelSurchargePercent
        myresponse.Source = "fedEx_server"
        requestArgs.method == 'FEDEX_2_DAY' ? myresponse.data.express = fuelcharge : myresponse.data.ground = fuelcharge
        callback(null, myresponse);
      } catch (error) {
        // console.log(error)
        myresponse.Source = "default"
        requestArgs.method == 'FEDEX_2_DAY' ? myresponse.data.express = 7.5 : myresponse.data.ground = 7
        callback(null, myresponse);
      }
    });
  });
}



module.exports = {
  addressValidation,
  processShipment,
  getRates,
  getZone,
  getTracking,
  getFuelSurcharge,
  isResidential
  // AddOrderMainToConfirm  
}