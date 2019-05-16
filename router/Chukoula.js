const express = require('express');
const bodyParser = require('body-parser');
const myapi = require('../public/app')
const service = require('../service/api')
const PDFDocument = require('pdfkit');
const parseString = require('xml2js').parseString;
const UPS = require('../service/ups')
const FEDEX = require('../service/fedex')
const ENDICIA = require('../service/usps_endicia')
const  async = require('async');
const base64 = require('base64topdf');

const router = express.Router();
// router.get('/tracking/:id', (req, res) => {
//     let num = req.params.id
//     myapi.trackOne(num).then( result => res.send( JSON.stringify(result) ),(e) => res.sendStatus(400)); 
// })

router.get('/trackingAndShow/:id', (req, res) => {
    let num = req.params.id
    service.detectCarrier(num).then(result => {
        if(result === 'sf-express') result = 'shunfeng'
        res.redirect(`https://www.kuaidi100.com/chaxun?com=${result}&nu=${num}`)
    })
    .catch(err => console.log(err))
})

// router.post('/zoneLookUp', (req, res) => {
//     let from = req.body.from ;
//     let to = req.body.to ;
//     service.getUspsZone(from, to).then(result => { 
//            parseString(result, (err, result) => { 
//                let error = result.RateV4Response.Package[0].Error
//                let zoneCode = result.RateV4Response.Package[0].Zone
//                error?res.send( { success:false, description : error[0].Description[0]}):res.send( { success:true , zone : zoneCode[0]}) 
//             })    
//     }).catch(err => 
//         res.send({sucess:false,description:'server is down'})
//     )
// })

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
       service.varifyAddress(address, callback);
    }, function (err, result) {
       // console.log(result)
       // res.json(result)
       res.send({result:result});
    });
})

router.post('/zoneLookUp', (req, res) => {
    let {Zone_Pairs} = req.body
    async.mapLimit(Zone_Pairs, 50, function (record, callback) {
        service.getUspsZone(record, callback);
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
        service.createOrder(order, callback);
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
        service.getLabel(order, callback);
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
        service.getTrakcingNumber(order, callback);
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
        service.getReceivingExpense(id, callback);
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

 




    // res.send(res)
    // let {Orders} = req.body
    // console.log(req.body)
    // async.mapLimit(Orders, 50, function (order, callback) {
    //     service.createOrder(order, callback);
    //  }, function (err, result) {
    //     if(err)console.log(err)
    //     console.log(result)
    //     // res.json(result)
    //     res.send({result:result});
    //  });



// app.post('/getScanForm', (req, res) => {
//     // let from = req.body.from ;
//     // let to = req.body.to ;
//     service.getScanForm().then(result => { 
//            console.log(result)
//            parseString(result, (err, result) => { 
//             //    let error = result.RateV4Response.Package[0].Error
//             //    let zoneCode = result.RateV4Response.Package[0].Zone
//             //    error?res.send( { success:false, description : error[0].Description[0]}):res.send( { success:true , zone : zoneCode[0]}) 
//             res.send(result)
//             })    
//     }).catch(err => 
//         res.send({sucess:false,description:'server is down'})
//     )
// })


// app.get('/get-pdf', (req, res) => {
//     const doc = new PDFDocument();
//     const filename = 'my_pdf.pdf';
  
//     res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
//     res.setHeader('Content-type', 'application/pdf');
  
//     doc.font('./fonts/UPC-A.ttf').fontSize(50).text('121323132112');
//     doc.pipe(res);
//     doc.end();
//   });

// app.get('/trackings/:id', (req, res) => { 
//     let string = req.params.id
//     let arr = string.split(",");
//         array = arr.map( info => info.trim() )
//     myapi.trackList(array).then( result => res.send( JSON.stringify(result) ),(e) => res.sendStatus(400)); 
// })

module.exports = router

  
  
  
