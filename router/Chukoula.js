const express = require('express');
const bodyParser = require('body-parser');
const UPS_YI = require('../service/ups_yi')
const TOOL = require('../service/tool')
const PDFDocument = require('pdfkit');
const parseString = require('xml2js').parseString;
const UPS = require('../service/ups')
const USPS = require('../service/usps')
const FEDEX = require('../service/fedex')
const CHUKOULA = require('../service/chukoula')
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
    async.mapLimit(addressList, 25, function (address, callback) {
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
   async.mapLimit(addressList, 25, function (address, callback) {
       USPS.varifyAddress(address, callback);
    }, function (err, result) {
       // console.log(result)
       // res.json(result)
       res.send({result:result});
    });
})

router.post('/isDeliverable', (req, res) => {
    // service.varifyAddress().then(result => res.send(result)).catch(err => console.log(err))
    let {addressList} = req.body
    async.mapLimit(addressList, 25, function (address, callback) {
       UPS.verifyAddressUPS(address, callback);
     }, function (err, result) {
        var undeliverable_address  =  result.filter( item => item.deliverable == 'false' ).map(item => item.referenceNumber)
        var deliverable_address  =  result.filter( item => item.deliverable == 'true' ).map(item => item.referenceNumber)
        res.send({result:{undeliverable : undeliverable_address , deliverable : deliverable_address } });
     });
 })

router.post('/zoneLookUp', (req, res) => {
    let {Zone_Pairs} = req.body
    async.mapLimit(Zone_Pairs, 25, function (record, callback) {
      USPS.getUspsZone(record, callback);
     }, function (err, result) {
         if(err)console.log(err)
        // res.json(result)
        res.send({result:result});
     });
})

router.post('/zoneLookUpNew', (req, res) => {
    let {Zone_Pairs} = req.body
    async.mapLimit(Zone_Pairs, 25, function (record, callback) {
      USPS.getUspsZoneUpdate(record, callback);
     }, function (err, result) {
         if(err)console.log(err)
        // res.json(result)
        res.send({result:result});
     });
})

router.post('/createOrders', (req, res) => {
    let {Orders} = req.body
    async.mapLimit(Orders, 25, function (order, callback) {
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
    async.mapLimit(Orders, 25, function (order, callback) {
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
    async.mapLimit(order_id_list, 25, function (order, callback) {
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
    async.mapLimit(Reference_No, 25, function (id, callback) {
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
    async.mapLimit(parcels, 25, function (parcel, callback) {
        UPS.TrackingUPS(parcel, callback);
     }, function (err, result) {
        if(err)console.log(err)
        // console.log(result)
        // res.json(result)
        res.send({result:result});
     });
 })

 router.post('/inTransitTimeUps', (req, res) => {
    let {Postcode_Pairs} = req.body
    // Reference_No = [ "1676941641013" , "1645030501014" , "1677061012013"]
    async.mapLimit(Postcode_Pairs, 25, function (record, callback) {
        UPS.GetUpsInTransitTime(record, callback);
     }, function (err, result) {
        if(err)console.log(err)
        // console.log(result)
        // res.json(result)
        res.send({result:result});
     });
 })

 router.post('/getUpsTrackingStatus', (req, res) => {
    let {trackings} = req.body
    // Reference_No = [ "1676941641013" , "1645030501014" , "1677061012013"]
    async.mapLimit(trackings, 25, function (tracking, callback) {
        UPS.GetUpsTrackingStatus(tracking, callback);
     }, function (err, result) {
        if(err)console.log(err)
        var created_array =  result.filter( item => item.status == 'created' ).map(item => item.trackingNo)
        var intransit_array =  result.filter( item => item.status == 'in transit' ).map(item => item.trackingNo)
        var devlivery_array =  result.filter( item => item.status == 'delivered' ).map(item => item.trackingNo)
        var no_information_array =  result.filter( item => item.status == 'no information' ).map(item => item.trackingNo)

        res.send(
            {
             result:{ 
                      created : created_array  , 
                      in_transit : intransit_array ,
                      delivery: devlivery_array,
                      no_information : no_information_array ,
                    } 
            });
        // console.log(result)
        // res.json(result)
     });
 })

 router.post('/verifyAddressFEDEX', (req, res) => {
    let {
        addresList
    } = req.body
    // Reference_No = [ "1676941641013" , "1645030501014" , "1677061012013"]
    async.mapLimit(addresList, 25, function (address, callback) {
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
    async.mapLimit(orders, 25, function (order, callback) {
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
    async.mapLimit(args, 25, function (arg, callback) {
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
   async.mapLimit(orders, 25, function (order, callback) {
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


router.post('/createShippmentChukoula', (req, res) => {
    let {
        orders
    } = req.body
    // Reference_No = [ "1676941641013" , "1645030501014" , "1677061012013"]
    async.mapLimit(orders, 3, function (order, callback) {
        CHUKOULA.createOrder(order, callback);
     }, function (err, result) {
        if(err)console.log(err)
        // console.log(result)
        // res.json(result)
        res.send({result:result});
     });
 })

 

 
module.exports = router

  
  
  
