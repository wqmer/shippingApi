// const phantom = require('phantom');
// const createOrder = require('./uility/api').createOrder
const uuid = require('uuid')
const request = require('request');
const async = require('async');
const fs = require('fs');
const extend = require('extend');
const base64 = require('base64topdf');
const convert = require('convert-units')
const moment = require('moment')
const config = require('./service/config')
const USPS = require('usps-webtools');
var md5 = require('md5');


// const stripe = require("stripe")("sk_test_DivqW1nuPGpPCn8ZvHFaTs5400A7SdV62Y");


// stripe.customers.list(
//   { limit: 3 },
//   function(err, customers) {
//     // asynchronously called
//     if(err)console.log(err)
//     console.log(customers)
//   }
// );
// const date = new Date();
// console.log(new Date(date.getTime() + (24*60*60*1000)).toISOString())
// var myjson = { '123' : '123'}
// var mystring = '123'
// console.log((myjson + mystring).toString())


// class Carrier {
//       password = 0 ;
//       constructor(password) {
//             this.password = password ;
//       }

//       auth(){
//            let authObj = '123'
//            return authObj
//       }

//       ship(){
//         // console.log(auth())
//         // console.log('it works from ship ' + this.name + ' ' + args)
//       }

//       varifyAddress(){
//         console.log('it works from varify')
//       }

//       tracking(){
//         console.log('it works from tracking')
//      }
// }



// let order = 
// {
// 	"authorization": {
// 		"token": "f665224bd2a2b27565f17d4ed0bb13cd",
// 		"key": "f665224bd2a2b27565f17d4ed0bb13cdb342919df05b1ab44d9c160456827169"
// 	},
// 	"order": {
// 		"shippingMethodCode": "PK0006",
// 		"referenceNumber": "ck1231132132123123",
// 		"orderWeight": 0.5
// 	},
// 	"recipient": {
// 		"recipientName": "recipientName",
// 		"recipientAddress1": "recipientAddress1",
// 		"recipientCity": "recipientCity",
// 		"recipientProvince": "recipientProvince",
// 		"recipientPostCode": "recipientPostCode",
// 		"recipientCountryCode": "US",
// 		"recipientTelephone":"2155880271"
// 	},
// 		"shipper": {
// 		"shipperName": "TestByKimi",
// 		"shipperCountrycode": "US",
// 		"shipperProvince": "CA",
// 		"shipperCity": "Irvine",
// 		"shipperStreet": "shipperStreet",
// 		"shipperPostcode": "92606",
// 		"shipperTelephone": "63312345"
// 	},

// 	"declarationArr": [{
// 		"declareEnName": "NewTestByKimi",
// 		"declareQuantity": 1,
// 		"declareWeight": 3,
// 		"declareValue": 4,
// 		"declareCurrencycode": "USD",
// 		"sku": "PBK"
// 	}]
// }

// // createOrder(order)



// var concurrencyCount = 0; 
// // fetchUrl 模拟创建订单
// // var fetchUrl = function (url, callback) {
// //   var delay = parseInt((Math.random() * 10000000) % 10000, 10);//模拟创建订单耗时
// //   concurrencyCount++;
// //   console.log('现在的并发数是', concurrencyCount, '，正在生产订单的是', url, '，耗时' + delay + '毫秒');
// //   setTimeout(function () {
// //     concurrencyCount--;
// //     callback(null, url + ' 订单内容');
// //   }, delay);
// // };


// var createOrder = (order , callback) =>{
//     request({
//         method: 'POST',
//         headers: { "content-type": "application/json"},
//         // url:     'http://119.23.188.252/api/v1/orders/service/create',
//         url:     'http://test.chukou.la/action/interface.api.php',
//         body:   JSON.stringify(order)
//       }, function(error, response, body){
//         callback(null,response.body);
//       }); 
// }

// var Orders = [];
// for(var i = 0; i < 10; i++) {
//     let order = 
//     // {
//     //     "authorization": {
//     //         "token": "8c5b11fe10b339b586e1dbce234e2552",
//     //         "key": "8c5b11fe10b339b586e1dbce234e255252defb9b893f1d963665c9df97b3d7f2"
//     //     },
//     //     "order": {
//     //         "shippingMethodCode": "PK0006",
//     //         "referenceNumber": `${uuid()}`,
//     //         "orderWeight": 0.5
//     //     },
//     //     "recipient": {
//     //         "recipientName": "recipientName",
//     //         "recipientAddress1": "recipientAddress1",
//     //         "recipientCity": "recipientCity",
//     //         "recipientProvince": "recipientProvince",
//     //         "recipientPostCode": "recipientPostCode",
//     //         "recipientCountryCode": "US",
//     //         "recipientTelephone":"2155880271"
//     //     },
//     //         "shipper": {
//     //         "shipperName": "TestByKimi",
//     //         "shipperCountrycode": "US",
//     //         "shipperProvince": "CA",
//     //         "shipperCity": "Irvine",
//     //         "shipperStreet": "shipperStreet",
//     //         "shipperPostcode": "92606",
//     //         "shipperTelephone": "63312345"
//     //     },
    
//     //     "declarationArr": [{
//     //         "declareEnName": "NewTestByKimi",
//     //         "declareQuantity": 1,
//     //         "declareWeight": 3,
//     //         "declareValue": 4,
//     //         "declareCurrencycode": "USD",
//     //         "sku": "PBK"
//     //     }]
//     // }

//     {
//       "AppKey": "10d676c62b9d30c7471b2ec7f05f89b6",
//       "AppSecret": "d6b538c614ec9d1d83e0d6c336e93a83975ab85f",
//       "Method": "UPSTEST",
//       "OrderID": `${uuid()}`,
//       "Weight": 12,
//       "Sname": "KimiTest",
//       "Scompany": "KimiCompany",
//       "Sstate": "CA",
//       "Sadd1": " 2777 Alton Parkway",
//       "Sadd2": "Apt 347",
//       "Scity": "Irvine",
//       "Spostcode": "92606",
//       "Stel": "2155880271",
//       "Scountry": "US",
//       "Fname": "KimiTest",
//       "Fcountry": "US",
//       "Fstate": "CA",
//       "Fcity": "Irvine",
//       "Fadd1": "2513 Sullivan",
//       "Fadd2": "",
//       "Fpostcode": "92614",
//       "Ftel": "2155880271",
//       "Note": "test sku"
//   }
//   Orders.push(order);
// }

// async.mapLimit(Orders, 10, function (order, callback) {
//    createOrder(order, callback);
// }, function (err, result) {
//   console.log('final');
//   console.log(result);//模拟返回订单信息
// });


