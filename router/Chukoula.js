const express = require('express');
const bodyParser = require('body-parser');
const UPS_YI = require('../service/ups_yi')
const TOOL = require('../service/tool')
const PDFDocument = require('pdfkit');
const parseString = require('xml2js').parseString;
const UPS = require('../service/ups')
const USPS = require('../service/usps')
const FEDEX = require('../service/fedex')
const ENDICIA = require('../service/usps_endicia')
const async = require('async');
const base64 = require('base64topdf');

const router = express.Router();


router.get('/trackingAndShow/:id', (req, res) => {
    let num = req.params.id
    TOOL.detectCarrier(num).then(result => {
        if(result === 'sf-express') result = 'shunfeng'
        res.redirect(`https://www.kuaidi100.com/chaxun?com=${result}&nu=${num}`)
    })
    .catch(err => console.log(err))
})


router.post('/verifyAddressUPS', (req, res) => {
    // service.varifyAddress().then(result => res.send(result)).catch(err => console.log(err))
    let {addressList} = req.body
    async.mapLimit(addressList, 50, function (address, callback) {
        UPS.verifyAddressUPS(address, callback);
     }, function (err, result) {
        // console.log(result)
        // res.json(result)
        res.send({result:result});
     });
})

router.post('/verifyAddressUSPS', (req, res) => {
   // service.varifyAddress().then(result => res.send(result)).catch(err => console.log(err))
   let {addressList} = req.body
   async.mapLimit(addressList, 50, function (address, callback) {
       USPS.varifyAddress(address, callback);
    }, function (err, result) {
       // console.log(result)
       // res.json(result)
       res.send({result:result});
    });
})

router.post('/zoneLookUp', (req, res) => {
    let {Zone_Pairs} = req.body
    async.mapLimit(Zone_Pairs, 50, function (record, callback) {
      USPS.getUspsZone(record, callback);
     }, function (err, result) {
         if(err)console.log(err)
        // res.json(result)
        res.send({result:result});
     });
})

router.post('/createOrders', (req, res) => {
    let {Orders} = req.body
    console.log(req.body)
    async.mapLimit(Orders, 50, function (order, callback) {
      UPS_YI.createOrder(order, callback);
     }, function (err, result) {
        if(err)console.log(err)
        // console.log(result)
        // res.json(result)
        res.send({result:result});
     });
})

router.post('/createShippment', (req, res) => {
    let {Orders} = req.body
    // console.log(req.body)
    async.mapLimit(Orders, 50, function (order, callback) {
      UPS_YI.getLabel(order, callback);
     }, function (err, result) {
        if(err)console.log(err)
        // console.log(result)
        // res.json(result)
        res.send({result:result});
     });
})

router.post('/getTrackingNo', (req, res) => {
    let {order_id_list} = req.body
    // console.log(req.body)
    async.mapLimit(order_id_list, 50, function (order, callback) {
      UPS_YI.getTrakcingNumber(order, callback);
     }, function (err, result) {
        if(err)console.log(err)
        // console.log(result)
        // res.json(result)
        res.send({result:result});
     });
})


router.post('/getReceivingExpense', (req, res) => {
    let {Reference_No} = req.body
    // Reference_No = [ "1676941641013" , "1645030501014" , "1677061012013"]
    async.mapLimit(Reference_No, 50, function (id, callback) {
        UPS_YI.getReceivingExpense(id, callback);
     }, function (err, result) {
        if(err)console.log(err)
        // console.log(result)
        // res.json(result)
        res.send({result:result});
     });
 })


 router.post('/trackingUps', (req, res) => {
    let {parcels} = req.body
    // Reference_No = [ "1676941641013" , "1645030501014" , "1677061012013"]
    async.mapLimit(parcels, 50, function (parcel, callback) {
        UPS.TrackingUPS(parcel, callback);
     }, function (err, result) {
        if(err)console.log(err)
        // console.log(result)
        // res.json(result)
        res.send({result:result});
     });
 })

 router.post('/verifyAddressFEDEX', (req, res) => {
    let {
        addresList
    } = req.body
    // Reference_No = [ "1676941641013" , "1645030501014" , "1677061012013"]
    async.mapLimit(addresList, 50, function (address, callback) {
        FEDEX.addressValidation(address, callback);
     }, function (err, result) {
        if(err)console.log(err)
        // console.log(result)
        // res.json(result)
        res.send({result:result});
     });
 })

 router.post('/createShippmentFEDEX', (req, res) => {
    let {
        orders
    } = req.body
    // Reference_No = [ "1676941641013" , "1645030501014" , "1677061012013"]
    async.mapLimit(orders, 50, function (order, callback) {
        FEDEX.processShipment(order, callback);
     }, function (err, result) {
        if(err)console.log(err)
        // console.log(result)
        // res.json(result)
        res.send({result:result});
     });
 })

 router.post('/getRateFEDEX', (req, res) => {
    let {
        args
    } = req.body
    // Reference_No = [ "1676941641013" , "1645030501014" , "1677061012013"]
    async.mapLimit(args, 50, function (arg, callback) {
        FEDEX.getRates(arg, callback);
     }, function (err, result) {
        if(err)console.log(err)
        // console.log(result)
        // res.json(result)
        res.send({result:result});
     });
 })

 router.post('/createShippmentUSPS', (req, res) => {
   let {
       orders
   } = req.body
   // Reference_No = [ "1676941641013" , "1645030501014" , "1677061012013"]
   async.mapLimit(orders, 50, function (order, callback) {
       ENDICIA.GetPostageLabel(order, callback);
      //  console.log(order)
    }, function (err, result) {
       if(err)console.log(err)
      //  console.log(result[0].LabelRequestResponse)
       // res.json(result)
      //  base64.base64Decode(result[0].LabelRequestResponse.Base64LabelImage, 'LABEL.png');
      //  console.log(result.LabelRequestResponse.Base64LabelImage)
       res.send({result:result});
    });
})

router.post('/buyPostageEndicia', (req, res) => {
   let {
       orders
   } = req.body
   // Reference_No = [ "1676941641013" , "1645030501014" , "1677061012013"]
   async.mapLimit(orders, 50, function (order, callback) {
       ENDICIA.BuyPostage(order, callback);
      //  console.log(order)
    }, function (err, result) {
       if(err)console.log(err)
       // console.log(result)
       // res.json(result)
       res.send({result:result});
   
    });
})

 
module.exports = router

  
  
  
