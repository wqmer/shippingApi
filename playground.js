// const phantom = require('phantom');
// const createOrder = require('./uility/api').createOrder
const uuid = require('uuid')
const request = require('request');
const async = require('async');
const fs = require('fs');
const extend = require('extend');
const base64 = require('base64topdf');
const base64ToImage = require('base64-to-image');
const convert = require('convert-units')
const moment = require('moment')
const config = require('./service/config')
const USPS = require('usps-webtools');
const md5 = require('md5');
const image2base64 = require('image-to-base64');

const parseString = require('xml2js').parseString;
const builder = require('xmlbuilder');




// var base64Str = "Add valid base64 str";
// var path ='./public';
// var optionalObj = {'fileName': 'label', 'type':'png'};

//     base64ToImage(base64Str,path,optionalObj); 
    
// var imageInfo = base64ToImage(base64Str,path,optionalObj); 

// // image2base64( "http://119.23.188.252/index/get-label/code/YMAB20190706000447") // you can also to use url
// //     .then(
// //         (response) => {
// //             console.log(response); //cGF0aC90by9maWxlLmpwZw==
// //         }
// //     )
// //     .catch(
// //         (error) => {
// //             console.log(error); //Exepection error....
// //         }
// //     )

// console.log(process.env.UPS_USERNAME)
var ip = require("ip");
console.log( ip.address() );

// var optionalObj = {'fileName': 'testlabel', 'type':'png'};
// var path = './'
// var base64Str = 
// base64ToImage(base64Str,path,optionalObj); 


// const requestData = {"instructionList":[{"channelCode":"FirstParcel","userOrderNumber":"5296000000587938---20190625888296","remark":"","sender":{"contactName":"NC","telephone":"5412545474","countryCode":"US","state":"NC","city":"Raleigh","street":"2434 Bertie Drive","street1":"","street2":"","county":"","zipCode":"27610","zip4":""},"recipient":{"contactName":"Lisa Thompson","telephone":"6627926425","countryCode":"US","state":"MS","city":"West","street":"2071 Attala Road#3009","street1":"","street2":"","county":"","zipCode":"39192","zip4":""},"packageDetailList":[{"packageRecord":{"sonOrderNumber":"","boxNumber":"","weight":0.23,"length":1,"width":1,"height":1},"itemList":[{"productName":"891914284586850","productNameEn":"891914284586850","productSku":"","hsCode":1,"quantity":"1","unitPrice":"891914284586850","unitWeight":0.23}]}]}]}
// const AppSecret = '/xoU5d/d7a+xDOboQmiOx/xsVRYuiOE8PfSH6OSl'
// const date = '2019-06-26 13:15:00'


// console.log(md5(JSON.stringify(requestData) + AppSecret + date));
// url: `http://production.shippingapis.com/ShippingAPI.dll?API=RateV4&XML=<RateV4Request USERID="${config.usps.user_id}">
// <Revision>2</Revision>
// <Package ID="1ST">
// <Service>PRIORITY</Service>
// <ZipOrigination>${zipcode_pair.from}</ZipOrigination>
// <ZipDestination>${zipcode_pair.to}</ZipDestination>
// <Pounds>0</Pounds>
// <Ounces>3.5</Ounces>
// <Container>VARIABLE</Container>
// <Size>REGULAR</Size>
// <Machinable>true</Machinable>
// <DropOffTime>08:00</DropOffTime>
// <ShipDate>${moment().add(1,'days').format('L')}</ShipDate>
// </Package>
// </RateV4Request>`,
// const param = {
//     Package: {
//       '@ID': '1ST',
//       Service: 'PRIORITY',
//       ZipOrigination: '92606',
//       ZipDestination: '19103',
//       Pounds: '1',
//       Ounces: '0' ,
//       Container: 'VARIABLE',
//       Size: 'REGULAR',
//       Machinable: true
//     }
//   };
// const obj = {
//     ['RateV4Request']: {
//       // Until jshint 2.10.0 comes out, we have to explicitly ignore spread operators in objects
//       // jshint ignore:start
//         ...param , 
//       // jshint ignore:end
//     ['@USERID']: '849XUEHU5746'
//     }
//   };
// const xml = builder.create(obj).end();
// const opts = {
//     url: 'http://production.shippingapis.com/ShippingAPI.dll',
//     qs: {
//       API: 'RateV4',
//       XML: xml
//     },
//   };

// request(opts, (err, res, body) => {
//     parseString(res.body, (err, result) => { 
//         let error = result.RateV4Response.Package[0].Error
//         let zoneCode = result.RateV4Response.Package[0].Zone
//         error? console.log ({ success:false, description : error[0].Description[0]}):console.log( { success:true , zone : zoneCode[0]}) 
//      })  
// })
 
// var xml = builder.create('root')
//   .ele('Revision')
//   .ele('Package')
//   .ele('Service')
//   .ele('ZipOrigination')
//   .ele('ZipDestination')
//   .ele('repo', {'type': 'git'}, 'git://github.com/oozcitak/xmlbuilder-js.git')
//   .end({ pretty: true});
 
// console.log(xml);
// const stripe = require("stripe")("sk_test_DivqW1nuPGpPCn8ZvHFaTs5400A7SdV62Y");
// const usps = new USPS({
//     server: 'http://production.shippingapis.com/ShippingAPI.dll',
//     userId: '849XUEHU5746',
//     // ttl: 10000 //TTL in milliseconds for request
//   });
//   usps.pricingRateV4({        
//   Service: 'PRIORITY',
//   ZipOrigination:  92606,
//   ZipDestination: 19103,
//   Pounds: 1,
//   Ounces: 0,
//   Container: 'VARIABLE',
//   Size: 'REGULAR',
// //   Girth: pricingRate.Girth,
//   Machinable: true
// } ,  function(err, ZONE) {
//     if(err)console.log(err)
//     console.log(ZONE); })

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


