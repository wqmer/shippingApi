// const phantom = require('phantom');
// const createOrder = require('./uility/api').createOrder
const uuid = require('uuid')
const request = require('request');
var async = require('async');
var fs = require('fs');

//     PNG = require('pngjs').PNG;

    // var data = fs.readFileSync('test.png');
    // var png = PNG.sync.read(data);  
    // console.log(png)


    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument;

    doc.pipe(fs.createWriteStream('outputNew.pdf'));

    doc.addPage()
       .image('./test.png', {
        fit: [500,400],
        align: 'center',
        valign: 'center'
});

    // doc.image('blank.png', {
    //     fit: [800, 1200],
    //     align: 'center',
    //     valign: 'center'
    //  });
    // //  doc.addPage()
    //  doc.end();
   



    // const HummusRecipe = require('hummus-recipe');
    // const pdfDoc = new HummusRecipe('new', 'output-new.pdf');
    // pdfDoc.createPage('A4')
    // pdfDoc.image('test.png',1,1  ,
    //     { width: 300, keepAspectRatio: true}
    // )
    // .endPage()
    // // end and save
    // .endPDF();

// const pdfDoc = new HummusRecipe('output-new.pdf', 'output.pdf');
// pdfDoc
//     // edit 1st page
//     .editPage(1)
//     // .text('example-sku', 80, 1100 , {   color: '066099' ,   fontSize: 60,  })
//     // .rectangle(20, 20, 40, 100)
//     // .comment('Add 1st comment annotaion', 200, 300)
//     .image('test.png', 5, 3,{width: 200, height: 100})
//     .endPage()
//     // edit 2nd page
//     // .editPage(2)
//     // .comment('Add 2nd comment annotaion', 200, 100)
//     // .endPage()
//     // end and save
//     .endPDF();

    // const pdfDoc = new HummusRecipe('input.pdf', 'output.pdf');
// console.log(pdfDoc.metadata);

// const pdfDoc = new HummusRecipe('input.pdf', 'output.pdf');
// const longPDF = 'test.pdf';
// pdfDoc
//     // // just page 10
//     // .appendPage(longPDF, 10)
//     // // page 4 and page 6
//     // .appendPage(longPDF, [4, 6])
//     // // page 1-3 and 6-20
//     // .appendPage(longPDF, [[1, 3], [6, 20]])
//     // all pages
//     .appendPage(longPDF)
//     .endPDF();


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
//         url:     'http://119.23.188.252/api/v1/orders/service/create',
//         body:   JSON.stringify(order)
//       }, function(error, response, body){
//         callback(null,response.body);
//       }); 
// }

// var Orders = [];
// for(var i = 0; i < 300; i++) {
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

// async.mapLimit(Orders, 200, function (order, callback) {
//    createOrder(order, callback);
// }, function (err, result) {
//   console.log('final');
//   console.log(result);//模拟返回订单信息
// });




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
// let a = {b : 1}
// let b = [1,23,4]
// console.log(Array.isArray(b))