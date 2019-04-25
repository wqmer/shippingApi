// const phantom = require('phantom');
// const createOrder = require('./uility/api').createOrder
const uuid = require('uuid')
const request = require('request');
var async = require('async');
const fs = require('fs');
const readline = require('readline');


var createOrder = (order , callback) =>{
  request({
      method: 'POST',
      headers: { "content-type": "application/json"},
      url:     'http://119.23.188.252/api/v1/orders/service/create',
      body:   JSON.stringify(order)
    }, function(error, response, body){
      callback(null,response.body);
    }); 
}

var cancelOrder =  (order , callback) =>{
request({
    method: 'POST',
    headers: { "content-type": "application/json"},
    url:     'http://119.23.188.252/api/v1/orders/service/cancel',
    body:   JSON.stringify(order)
  }, function(error, response, body){
    callback(null,response.body);
  }); 
}


var cancel_orders = []
var Orders = fs.readFileSync('85.txt').toString().split("\n");
// console.log(Orders)
for(i in Orders) {
    Orders[i] = Orders[i].replace(/(\r\n|\n|\r)/gm, "");
    // conle.log(Orders[i])
    let cancel_order = {
              "authorization": {
                  "token": "f665224bd2a2b27565f17d4ed0bb13cd",
                  "key": "f665224bd2a2b27565f17d4ed0bb13cdb342919df05b1ab44d9c160456827169"
              },
              "waybillNumber": Orders[i]
            }
    cancel_orders.push(cancel_order)
}


// var concurrencyCount = 0; 
// fetchUrl 模拟创建订单
// var fetchUrl = function (url, callback) {
//   var delay = parseInt((Math.random() * 10000000) % 10000, 10);//模拟创建订单耗时
//   concurrencyCount++;
//   console.log('现在的并发数是', concurrencyCount, '，正在生产订单的是', url, '，耗时' + delay + '毫秒');
//   setTimeout(function () {
//     concurrencyCount--;
//     callback(null, url + ' 订单内容');
//   }, delay);
// };



// var Orders = [];
// for(var i = 0; i < 10; i++) {
//     let order = 
//     {
//         "authorization": {
//             "token": "f665224bd2a2b27565f17d4ed0bb13cd",
//             "key": "f665224bd2a2b27565f17d4ed0bb13cdb342919df05b1ab44d9c160456827169"
//         },
//         "order": {
//             "shippingMethodCode": "PK0006",
//             "referenceNumber": `${uuid()}`,
//             "orderWeight": 0.5
//         },
//         "recipient": {
//             "recipientName": "recipientName",
//             "recipientAddress1": "recipientAddress1",
//             "recipientCity": "recipientCity",
//             "recipientProvince": "recipientProvince",
//             "recipientPostCode": "recipientPostCode",
//             "recipientCountryCode": "US",
//             "recipientTelephone":"2155880271"
//         },
//             "shipper": {
//             "shipperName": "TestByKimi",
//             "shipperCountrycode": "US",
//             "shipperProvince": "CA",
//             "shipperCity": "Irvine",
//             "shipperStreet": "shipperStreet",
//             "shipperPostcode": "92606",
//             "shipperTelephone": "63312345"
//         },
    
//         "declarationArr": [{
//             "declareEnName": "NewTestByKimi",
//             "declareQuantity": 1,
//             "declareWeight": 3,
//             "declareValue": 4,
//             "declareCurrencycode": "USD",
//             "sku": "PBK"
//         }]
//     }
//   Orders.push(order);
// }
// console.log(Orders)

// const order = []



// async.mapLimit(Orders, 9, function (order, callback) {
//    createOrder(order, callback);
// }, function (err, result) {
//   console.log('final');
//   console.log(result);//模拟返回订单信息
// });



async.mapLimit( cancel_orders, 9, function (order, callback) {
  cancelOrder(order, callback);
}, function (err, result) {
 console.log('final');
 console.log(result);//模拟返回订单信息
});




// (async function() {
//   const instance = await phantom.create();
//   const page = await instance.createPage();
//   await page.on('onResourceRequested', function(requestData) {
//   console.info('Requesting', requestData.url);
//   });

//   const status = await page.open('https://stackoverflow.com/');
//   const content = await page.property('content');
//   const result = await page.render('stackOverFlow.pdf')
//   console.log(content);

//   await instance.exit();
// })();

// var phantom = require('phantom');   
// phantom.create().then(function(ph) {
//     ph.createPage().then(function(page) {
//         page.open("http://www.google.com").then(function(status) {
//             page.render('google.pdf').then(function() {
//                 console.log('Page Rendered');
//                 ph.exit();
//             });
//         });
//     });
// });