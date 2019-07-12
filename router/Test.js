const express = require('express');
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
const uuid = require('uuid')
const request = require('request');
const router = express.Router();












router.post('/testdelay', (req , res)=> {
    res.setTimeout(6000, function(){ res.send({status:'success'}); })
})

// router.post('/testSelf', (req , res)=> {
//         request({
//             timeout: 5000 ,
//             method: 'POST',
//             // url:     'https://chukoula-api-update.herokuapp.com/testdelay',
//             url:     'http://localhost:5000/testdelay',
//           }, function(error, response, body){
//             // console.log(error)
//             try {  
//                      res.send(JSON.parse(body));
//               } catch {
//                      res.send({ask:0 ,message:error.code})
//               } 
//           }); 
// })

router.get('/testBatchRequest', (req, res) => {
    let { 
        all,
        batch,
        url
    } = req.query

    const createOrder = (order) =>{
        request({
            method: 'POST',
            headers: { "content-type": "application/json"},
            // url:     'http://119.23.188.252/api/v1/orders/service/create',
            // url:     'http://test.chukou.la/action/interface.api.php',
            url ,
            body:   JSON.stringify(order)
          }, function(error, response, body){

            try {  
                s = response.body.substr(1);
                     // let myresponse = response.body
                     callback(null, JSON.parse(s));
              } catch (error) {
                     callback(null, {  "code": 505 , "message": "server disconnect" });
              } 
          }); 
    }
    
    var Orders = [];
    for(var i = 0; i < all; i++) {
        let order = 

        {
          "AppKey": "10d676c62b9d30c7471b2ec7f05f89b6",
          "AppSecret": "d6b538c614ec9d1d83e0d6c336e93a83975ab85f",
          "Method": "UPSTEST",
          "OrderID": `${uuid()}`,
          "Weight": 1,
          "Sname": "KimiTest",
          "Scompany": "KimiCompany",
          "Sstate": "CA",
          "Sadd1": " 2777 Alton Parkway",
          "Sadd2": "Apt 347",
          "Scity": "Irvine",
          "Spostcode": "92606",
          "Stel": "2155880271",
          "Scountry": "US",
          "Fname": "KimiTest",
          "Fcountry": "US",
          "Fstate": "CA",
          "Fcity": "Irvine",
          "Fadd1": "2513 Sullivan",
          "Fadd2": "",
          "Fpostcode": "92614",
          "Ftel": "2155880271",
          "Note": "test sku"
      }
          Orders.push(order);
    }



    async.mapLimit(Orders, batch, function (order, callback) {
        createOrder(order, callback);
     }, function (err, result) {
        if(err)console.log(err)
        // console.log(result)
        // res.json(result)
        res.send({result:result});
     });
 })



 module.exports = router