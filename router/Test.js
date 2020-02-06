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



router.post('/test_timeout_10', (req , res)=> {
    res.setTimeout(10000, function(){ res.send({status:'success' , message:'10秒后返回！'}); })
})

router.post('/test_timeout_15', (req , res)=> {
    res.setTimeout(15000, function(){ res.send({status:'success' , message:'15秒后返回！'}); })
})

router.post('/test_timeout_25', (req , res)=> {
    res.setTimeout(25000, function(){ res.send({status:'success' , message:'25秒后返回！'}); })
})

router.post('/test_timeout_30', (req , res)=> {
    res.setTimeout(30000, function(){ res.send({status:'success' , message:'30秒后返回！'}); })
})






 module.exports = router