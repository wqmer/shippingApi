const express = require('express');
const TOOL = require('../service/tool')
const PDFDocument = require('pdfkit');
const parseString = require('xml2js').parseString;

const UPS_YI = require('../service/ups_yi')
const USPS_MEIYUN = require('../service/usps_meiyun')
const UPS = require('../service/ups')
const USPS = require('../service/usps')
const FEDEX = require('../service/fedex')
const CHUKOULA = require('../service/chukoula')
const ENDICIA = require('../service/usps_endicia')

const async = require('async');
const base64 = require('base64topdf');
const uuid = require('uuid')
const request = require('request');
const router = express.Router();
const base64ToImage = require('base64-to-image');



//--易仓UPS创建订单返回单号
router.post('/createOrders', (req, res) => {
    try {
        let {Orders} = req.body
        async.mapLimit(Orders, 20, function (order, callback) {
          UPS_YI.createOrder(order, callback);
         }, function (err, result) {
            if(err)console.log(err)
            // console.log(result)
            // res.json(result)
            res.send({result:result});
         });
        
    } catch (error) {     
        res.send({  "code": 500 , "message": "internal error" });   
      
    }

})

//--易仓创建订单并返回单号和label
router.post('/createShippment', (req, res) => {
    try {
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
        
    } catch (error) {
        res.send({  "code": 500 , "message": "internal error" });   
    }

})

//--易仓UPS查询运单号，订单号和转单号
router.post('/getTrackingNo', (req, res) => {
    try {
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
        
    } catch (error) {
        res.send({  "code": 500 , "message": "internal error" });    
    }

})

//--易仓查询运费
router.post('/getReceivingExpense', (req, res) => {
    try {
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
        
    } catch (error) {
        res.send({  "code": 500 , "message": "internal error" });   
    }

 })



 //--ENDICIA 创建USPS订单
 router.post('/createShippmentUSPS', (req, res) => {
    try {
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
        
    } catch (error) {
        res.send({  "code": 500 , "message": "internal error" });    
    }

})

//--ENDICIA 运费充值
router.post('/buyPostageEndicia', (req, res) => {
    try {
        let {
            orders
        } = req.body
        async.mapLimit(orders, 50, function (order, callback) {
            ENDICIA.BuyPostage(order, callback);
         }, function (err, result) {
            if(err)console.log(err)
            // console.log(result)
            // res.json(result)
            res.send({result:result});
        
         });
        
    } catch (error) {
        res.send({  "code": 500 , "message": "internal error" });   
    }

})

//--fedex创建订单
router.post('/createShippmentFEDEX', (req, res) => {
    try {
        let {
            orders
        } = req.body
        // Reference_No = [ "1676941641013" , "1645030501014" , "1677061012013"]
        async.mapLimit(orders, 25, function (order, callback) {
            FEDEX.processShipment(order, callback);
         }, function (err, result) {
            if(err)console.log(err)
            // console.log(result)
            res.send({result:result});
         });
        
    } catch (error) {
        res.send({  "code": 500 , "message": "internal error" });    
    }

 })

//--fedex预估运费
router.post('/getRateFEDEX', (req, res) => {
    try {
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
        
    } catch (error) {
        res.send({  "code": 500 , "message": "internal error" });     
    }

 })

 

//出口拉创建订单
router.post('/createShippmentChukoula', (req, res) => {
    try {
        let {
            orders
        } = req.body
        // Reference_No = [ "1676941641013" , "1645030501014" , "1677061012013"]
        async.mapLimit(orders, 10, function (order, callback) {
            CHUKOULA.createOrder(order, callback);
         }, function (err, result) {
            if(err)console.log(err)
            // console.log(result)
            // res.json(result)
            res.send({result:result});
         });
        
    } catch (error) {
        res.send({  "code": 500 , "message": "internal error" });    
    }
 })


 router.post('/addSenderAddress', (req, res) => {
    try {
        let {
            address
        } = req.body
        // Reference_No = [ "1676941641013" , "1645030501014" , "1677061012013"]
        async.mapLimit(address, 10, function (record, callback) {
             USPS_MEIYUN.addSenderAddress(record, callback);
         }, function (err, result) {
            if(err)console.log(err)
            // console.log(result)
            // res.json(result)
            res.send({result:result});
         });
    } catch (error) {
        res.send({  "code": 500 , "message": "internal error" });   
    }

 })

 router.post('/createOrderMeiyun', (req, res) => {
    try {
        let {
            orders
        } = req.body
        // Reference_No = [ "1676941641013" , "1645030501014" , "1677061012013"]
        async.mapLimit(orders, 15, function (record, callback) {
             USPS_MEIYUN.getLabel(record, callback);
         }, function (err, result) {
            if(err)console.log(err)
            // console.log({result:result})
            res.send({result:result});
         });
    } catch (error) {
        // console.log({ "code": 500 , "message": "internal error" })
        res.send({  "code": 500 , "message": "internal error" });   
    }
 })





module.exports = router

  
  
  
