// const phantom = require('phantom');
// const createOrder = require('./uility/api').createOrder
const uuid = require('uuid')
const request = require('request');
const async = require('async');
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

var pdfcrowd = require("pdfcrowd");
const mergeImg = require('merge-img')
var fs = require('fs');
const _ = require('lodash')
// var pdf = require('html-pdf');


// PDFDocument = require('pdfkit');
// fs = require('fs');
// doc = new PDFDocument
const Easypost = require('@easypost/api');
const api = new Easypost('EZTKbbd59c4c5c9e418c88d60a0f9a1c3af4mnXJ3zNOfSAICBgN3MxJzQ');

/* Either objects or ids can be passed in for addresses and
 * shipments. If the object does not have an id, it will be
 * created. */
// const toAddress = 'adr_...';
// const fromAddress = 'adr_...';

/* Either objects or ids can be passed in for addresses and
 * shipments. If the object does not have an id, it will be
 * created. */
// const address = 'adr_...';
// const shipment = 'shp_...';

// const shipment = new api.Shipment({
//     parcel: {
//         predefined_package: 'FedExBox',
//         weight: 10.2
//     }
// })

const customsInfo = new api.CustomsInfo({
    eel_pfc: 'NOEEI 30.37(a)',
    customs_certify: true,
    customs_signer: 'Steve Brule',
    contents_type: 'merchandise',
    contents_explanation: '',
    restriction_type: 'none',
    restriction_comments: '',
    non_delivery_option: 'abandon',

    /* customs_items can be passed in as instances or ids.
    *  if the item does not have an id, it will be created. */
    customs_items: [
      new api.CustomsItem({
      'description': 'Sweet shirts',
      'quantity': 2,
      'weight': 11,
      'value': 23,
      'hs_tariff_number': '654321',
      'origin_country': 'US'
    })],
  });

  customsInfo.save().then(console.log);

// const toAddress = new api.Address({
//     street1: '417 MONTGOMERY ST',
//     street2: 'FLOOR 5',
//     city: 'SAN FRANCISCO',
//     state: 'CA',
//     zip: '94104',
//     country: 'US',
//     company: 'EasyPost',
//     phone: '415-123-4567',
// });

// const fromAddress = new api.Address({
//     street1: '417 MONTGOMERY ST',
//     street2: 'FLOOR 5',
//     city: 'SAN FRANCISCO',
//     state: 'CA',
//     zip: '94104',
//     country: 'US',
//     company: 'EasyPost',
//     phone: '415-123-4567',
// });
// const parcel = new api.Parcel({
//     length: 20.2,
//     width: 10.9,
//     height: 5,
//     weight: 65.9
//   });


// const shipment = new api.Shipment({
//     to_address : toAddress,
//     from_address : fromAddress,
//     parcel: parcel,
// });

// shipment.save().then( result =>console.log(result));



// const address = new api.Address({
//     street1: '417 MONTGOMERY ST',
//     street2: 'FLOOR 5',
//     city: 'SAN FRANCISCO',
//     state: 'CA',
//     zip: '94104',
//     country: 'US',
//     company: 'EasyPost',
//     phone: '415-123-4567',
// });

// console.log(shipment)

// const pickup = new api.Pickup({
//     address,
//     shipment,
//     reference: 'my-first-pickup',
//     min_datetime: '2020-2-21 10:30:00',
//     max_datetime: '2014-2-22 10:30:00',
//     is_account_address: false,
//     instructions: 'Special pickup instructions',
// });

// pickup.save().then(console.log)
//     .catch(error => console.log(error))

// const order = new api.Order({
//     to_address: toAddress,
//     from_address: fromAddress,
//     shipments: [
//         new api.Shipment({
//             parcel: {
//                 predefined_package: 'FedExBox',
//                 weight: 10.2
//             }
//         }),
//         new api.Shipment({
//             parcel: {
//                 predefined_package: 'FedExBox',
//                 weight: 17.5
//             }
//         })
//     ]
// });

// order.save()
//     .then(console.log)
//     .catch(error => console.log(error) ) 



// request({
//     //所有需要请求的内容，方法
//     method,
//     url,
//     body,
// })
//     .then(result => {
//         //使用拿到的结果去写数据库 ，connection 需要改写 promise ，原生没有这个方法
//         connection.query(...).then(result => {
//             //用result 判断， callback 正确 response
//             callback(...)
//         }).catch(err => {
//             //如果出错再去callback 错误的返回，这个错误是返回写数据出现的错误
//             callback(...)
//         })
//     })
//     .catch(err => {
//         //如果出错再去callback 错误的返回，这个错误是返回 request 出现的错误
//     });





// const query_all = 'SELECT * FROM test';

// const db_qurey = (query) => {
//     return new Promise((resolve, reject) => {
//         connection.query(query, function (err, results) {
//             if (err) {
//                 reject(err)
//                 // throw err;
//             }
//             resolve(results);
//         });
//     })
// }

// db_qurey(query_all)
//     .then(result => console.log(result)) // 处理resolve穿过来的结果››
//     .catch(error => console.log(eror))//处理reject 的错误


// app.use('/', require('./router/Chukoula'));





// const data =
//     [
//         {
//             orderId: undefined,
//             trackingNo: '78985112312312859331',
//             status: 'ERROR',
//             message:
//                 'This tracking number cannot be found. Please check the number or contact the sender.',
//             data: { DatesOrTimes: undefined, Events: undefined }
//         },
//         {
//             orderId: undefined,
//             trackingNo: '778456167529',
//             status: 'SUCCESS',
//             message: 'Request was successfully processed.',
//             data: {
//                 DatesOrTimes: [{
//                     Type: 'ANTICIPATED_TENDER',
//                     DateOrTimestamp: '2019-12-05T00:00:00'
//                 }]
//             }
//         },
//         {
//             orderId: undefined,
//             trackingNo: '778160486089',
//             status: 'SUCCESS',
//             message: 'Request was successfully processed.',
//             data: {
//                 DatesOrTimes: [{
//                     Type: 'ACTUAL_DELIVERY',
//                     DateOrTimestamp: '2019-11-27T16:17:00-05:00'
//                 },
//                 {
//                     Type: 'ACTUAL_PICKUP',
//                     DateOrTimestamp: '2019-11-25T20:01:00-08:00'
//                 },
//                 { Type: 'SHIP', DateOrTimestamp: '2019-11-25T00:00:00' },
//                 {
//                     Type: 'ACTUAL_TENDER',
//                     DateOrTimestamp: '2019-11-25T17:36:00-08:00'
//                 }]
//             }
//         },
//         {
//             orderId: undefined,
//             trackingNo: '789851859331',
//             status: 'SUCCESS',
//             message: 'Request was successfully processed.',
//             data: {
//                 DatesOrTimes: [{
//                     Type: 'ACTUAL_PICKUP',
//                     DateOrTimestamp: '2019-09-17T00:00:00'
//                 },
//                 { Type: 'SHIP', DateOrTimestamp: '2019-09-17T00:00:00' }]
//             }
//         },
//         {
//             orderId: undefined,
//             trackingNo: '780847581243',
//             status: 'SUCCESS',
//             message: 'Request was successfully processed.',
//             data: {
//                 DatesOrTimes: [{
//                     Type: 'ANTICIPATED_TENDER',
//                     DateOrTimestamp: '2019-11-12T00:00:00'
//                 }]
//             }
//         }]

// let filter_data =
// _.chain(data)
//    .groupBy(function (item) {
//       if (Array.isArray(item.data.DatesOrTimes)) {
//          let type_name = item.data.DatesOrTimes[0].Type
//          if (type_name == "ACTUAL_DELIVERY") return 'Delivery'
//          if (type_name == "ANTICIPATED_TENDER") return 'Created'
//          return 'In_Transit'
//       } else {
//          return 'No_Information'
//       }
//    })
//    .mapValues(array => array.map( item => item.trackingNo ) )
//    .value()

// console.log(filter_data);
// console.log(
//     _.chain(data)
//         // Group the elements of Array based on `color` property
//         .mapValues()
//         .groupBy("")
//         // `key` is group's name (color), `value` is the array of objects
//         .map((value, key) => ({ color: key, users: value }))
//         .value()
// );
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