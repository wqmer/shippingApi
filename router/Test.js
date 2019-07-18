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



 module.exports = router