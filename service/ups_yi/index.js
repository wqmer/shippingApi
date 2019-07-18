
const request = require('request');
const Aftership = require('aftership')('23a9737b-d9d7-45c1-851e-f85cb58bbcbc');
const apiKey = "29833628d495d7a5";
const moment = require('moment')
const image2base64 = require('image-to-base64');
const request_obj = require('./api').reqeust_obj
const request_url = require('./api').request_url
const parseString = require('xml2js').parseString;


// const createOrder = (order , callback) =>{
//     request({
//         method: 'POST',
//         headers: { "content-type": "application/json"},
//         url:     'http://119.23.188.252/api/v1/orders/service/create',
//         body:   JSON.stringify(order)
//       }, function(error, response, body){
//          let orderId = order.order.referenceNumber
//         callback(null, {...JSON.parse(response.body), referenceNumber: orderId });
//       }); 
// }


const createOrder = (order , callback) =>{
      request(request_obj(20000, order , request_url.create_order) , (error, response, body) => {
      let orderId = order.order.referenceNumber
          error ?callback(null ,{ask:0 , message: error}) : callback(null, {...JSON.parse(response.body), referenceNumber: orderId });   
      }); 
}

// const getTrakcingNumber = (order , callback) =>{
//     request({
//         method: 'POST',
//         headers: { "content-type": "application/json"},
//         url:     'http://119.23.188.252/api/v1/orders/service/getTrackingNumber',
//         body:   JSON.stringify(order)
//       }, function(error, response, body){
//          let myReponse =  JSON.parse(response.body)
//         callback(null, myReponse.data);
//       }); 
// }

const getTrakcingNumber = (param , callback) =>{
      request(request_obj(10000, param , request_url.get_tracking_no)  , (error, response, body) => {
        error?callback(null ,{ask:0 , message: error}) : callback(null, {...JSON.parse(response.body)});   
      }); 
}


// const createOrder_async = (order) =>{
//     return new Promise ((resolve , reject) => {
//     request({
//         timeout: 20000,
//         method: 'POST',
//         headers: { "content-type": "application/json"},
//         url:     'http://119.23.188.252/api/v1/orders/service/create',
//         body:   JSON.stringify(order)
//       }, function(error, response, body){
//         let orderId = order.order.referenceNumber
//         if(error){   resolve({ask : 0, message: error.code ,  referenceNumber: orderId });  }    
//         try{
//             resolve({...JSON.parse(response.body), referenceNumber: orderId });
//           } catch(error) { 
//             resolve({ask : 0, message: error ,  referenceNumber: orderId });
//         }
      
//       }); 
//     })
// }

const createOrder_async = (order) =>{
    return new Promise ((resolve , reject) => {
    request(request_obj(20000, order , request_url.create_order), (error, response, body) => {
           let orderId = order.order.referenceNumber
           error?resolve({ask : 0, message: error.code ,  referenceNumber: orderId }): resolve({...JSON.parse(response.body), referenceNumber: orderId });    
      }); 
    })
}


// const getLabel = (order, callback) => {
//     createOrder_async(order).then( result => {
//     if(result.ask == 0 && !result.message.includes("参考单号已存在")){
//         // console.log("test" )
//         callback(null , {...result, referenceNumber: order.order.referenceNumber , labelUrl:'' } )   
//     } else {
//         let param = {
//             "authorization": {
//             "token": order.authorization.token,
//             "key":  order.authorization.key
//                },
//             "waybillNumber": order.order.referenceNumber
//             }
//         request({
//                  timeout: 10000,
//                  method: 'POST',
//                  headers: { "content-type": "application/json"},
//                  url:   'http://119.23.188.252/api/v1/orders/service/getLabel',
//                  body:   JSON.stringify(param)
//             }, function(error, response, body){
//                 if(error) callback({ask : 0, message: error.code ,  referenceNumber:  order.order.referenceNumber });
//                 let myReponse = JSON.parse(  response.body )
//                 // callback(null, response.body)
//                 // console.log(param)
//             callback(null, { 
//                 ask: 1 , message: "Success", 
//                 referenceNumber: order.order.referenceNumber ,
//                 waybillNumber: "YMAF20190711000031",
//                 trackingNumber: "YMAF20190711000031",
//                 sku:order.declarationArr[0].declareEnName, 
//                 labelUrl:myReponse.data?myReponse.data.url:'' });
//         });     
//     }
//     // console.log(result)
//     }).catch(err => callback(null, { ask:0 , message:"Interal error"}))
// }

// const getLabel = (order, callback) => {
//     createOrder_async(order).then( result => {
//     if(result.ask == 0 ){
//         if(result.message.includes("参考单号已存在")){      
//            let param = {
//                 "authorization": {
//                 "token": order.authorization.token,
//                 "key":  order.authorization.key
//                    },
//                 "waybillNumber": order.order.referenceNumber
//                 }
//             request({
//                      timeout: 10000,
//                      method: 'POST',
//                      headers: { "content-type": "application/json"},
//                      url:  'http://119.23.188.252/api/v1/orders/service/getTrackingNumber',
//                      body:   JSON.stringify(param)
//             }, function(error, response, body){
//                 var myReponse = JSON.parse(response.body )    
//             if(error) {
//                     callback({ask : 0, message: error.code ,  referenceNumber:  order.order.referenceNumber });
//             }else {     
             
//                 if (myReponse.ask == 1 && myReponse.message == 'Success' ) {
//                     callback(null, { 
//                        ask: 1 , message: "Success", 
//                        referenceNumber: order.order.referenceNumber ,
//                        waybillNumber: myReponse.data.waybillNumber,
//                        trackingNumber: myReponse.data.trackingNumber,
//                        serverNumber: "",
//                        isAsynch: "N",
//                        sku:order.declarationArr[0].declareEnName, 
//                        labelUrl: `http://119.23.188.252/index/get-label/code/${myReponse.data.waybillNumber}`
//                    });
//                 }else {
//                     callback(null, { 
//                         ask: 0 , message: "订单号（order id）有问题，请联系管理员", 
//                     });


//                 // if(order.order.shippingMethodCode == "PK0006"){
//                 //     callback(null, { 
//                 //         ask: 1 , message: "Success", 
//                 //         ...result.data,
//                 //         sku:order.declarationArr[0].declareEnName, 
//                 //         labelUrl:`http://119.23.188.252/index/get-label/code/${myReponse.data.waybillNumber}` ,
//                 //         labelBase64 :''
//                 //     });
//                 // } else {                
//                 //     image2base64(`http://119.23.188.252/index/get-label/code/${myReponse.data.waybillNumber}`) // you can also to use url
//                 //     .then(
//                 //         (label) => {
//                 //             callback(null, { 
//                 //                 ask: 1 , message: "Success", 
//                 //                 referenceNumber: order.order.referenceNumber ,
//                 //                 waybillNumber: myReponse.data.waybillNumber,
//                 //                 trackingNumber: myReponse.data.trackingNumber,
//                 //                 serverNumber: "",
//                 //                 isAsynch: "N",
//                 //                 sku:order.declarationArr[0].declareEnName, 
//                 //                 labelUrl: `http://119.23.188.252/index/get-label/code/${myReponse.data.waybillNumber}` ,
//                 //                 labelBase64 :label
//                 //             });
//                 //         }
//                 //     )
//                 //     .catch(
//                 //         (error) => {
//                 //             callback({ask : 0, message: "failed to convert png" ,  referenceNumber:  order.order.referenceNumber });
//                 //         }
//                 //     )  
//                 // }



//                 }



//             } });
//         } else {     
//                 callback(null , {...result, referenceNumber: order.order.referenceNumber , labelUrl:'' } ) 
//               }
    
//     } else {
//         if(order.order.shippingMethodCode === "PK0006"){
//             callback(null, { 
//                 ask: 1 , 
//                 message: "Success", 
//                 ...result.data,
//                 sku:order.declarationArr[0].declareEnName, 
//                 labelUrl:`http://119.23.188.252/index/get-label/code/${result.data.waybillNumber}` ,
//                 labelBase64 :''
//             });
//         } else {
//             // image2base64(`http://119.23.188.252/index/get-label/code/${result.data.waybillNumber}`) 
//             // .then(
//             //     (label) => {
//             //         callback(null, { 
//             //             ask: 1 , message: "Success", 
//             //             ...result.data,
//             //             sku:order.declarationArr[0].declareEnName, 
//             //             labelUrl:`http://119.23.188.252/index/get-label/code/${result.data.waybillNumber}`,
//             //             labelBase64 :label
//             //         });
//             //     }
//             // )
//             // .catch(
//             //     (error) => {
//             //         // throw new Error("no label to convert due to test order")
//             //         callback({ask : 0, message: "failed to convert png" ,  referenceNumber:  order.order.referenceNumber });
//             //     }
//             // )
//             callback(null, { 
//                 ask: 1 , message: "Success", 
//                 ...result.data,
//                 sku:order.declarationArr[0].declareEnName, 
//                 labelUrl:`http://119.23.188.252/index/get-label/code/${result.data.waybillNumber}`
//             });
//         }
    
//     }
//     }).catch(err => {
//         console.log(err)
//         callback(null, { ask:0 , message: "Interal error" })
//     })
// }


const getLabel = (order, callback) => {
      createOrder_async(order).then( result => {
     // 判断创建订单是否成功
      if(result.ask == 0 ){
         //不成功情况下，order id 已存在的情况下，去请求远程易仓服务器订单信息
         if(result.message.includes("参考单号已存在")){      
            let param = {
                          "authorization": {
                                            "token": order.authorization.token,
                                            "key":  order.authorization.key
                          },
                          "waybillNumber": order.order.referenceNumber
             }
             //获取换单号，和运单号
            request(request_obj(8000, param , request_url.get_tracking_no), (error, response, body) => {
                 var myReponse = JSON.parse(body)    
                 if(error) {
                             callback({ask : 0, message: error.code ,  referenceNumber:  order.order.referenceNumber });
                  } 
                 else {     
                          //成功获取后 返回订单信息
                    if(myReponse.ask == 1 && myReponse.message == 'Success') {
                             callback(null, { 
                                                ask: 1 , 
                                                message: "Success", 
                                                referenceNumber: order.order.referenceNumber ,
                                                waybillNumber: myReponse.data.waybillNumber,
                                                trackingNumber: myReponse.data.trackingNumber,
                                                serverNumber: "",
                                                isAsynch: "N",
                                                sku:order.declarationArr[0].declareEnName, 
                                                labelUrl: `http://119.23.188.252/index/get-label/code/${myReponse.data.waybillNumber}`
                                            });

                            // label 转换成 base64
                        // if(order.order.shippingMethodCode == "PK0006"){
                        //      callback(null, { 
                        //      ask: 1 , message: "Success", 
                        //      ...result.data,
                        //      sku:order.declarationArr[0].declareEnName, 
                        //      labelUrl:`http://119.23.188.252/index/get-label/code/${myReponse.data.waybillNumber}` ,
                        //      labelBase64 :''
                        //    });
                        // } else {                
                        //    image2base64(`http://119.23.188.252/index/get-label/code/${myReponse.data.waybillNumber}`) // you can also to use url
                        //     .then(
                        //      (label) => {
                        //          callback(null, { 
                        //              ask: 1 , message: "Success", 
                        //              referenceNumber: order.order.referenceNumber ,
                        //              waybillNumber: myReponse.data.waybillNumber,
                        //              trackingNumber: myReponse.data.trackingNumber,
                        //              serverNumber: "",
                        //              isAsynch: "N",
                        //              sku:order.declarationArr[0].declareEnName, 
                        //              labelUrl: `http://119.23.188.252/index/get-label/code/${myReponse.data.waybillNumber}` ,
                        //              labelBase64 :label
                        //          });
                        //         }
                        //     )
                        //     .catch(
                        //      (error) => {
                        //          callback({ask : 0, message: "failed to convert png" ,  referenceNumber:  order.order.referenceNumber });
                        //     })  
                        // }
                            //获取失败 ，返回
                    }else{  
                          callback(null, {  ask: 0 , message: myReponse.message + " ,请联系管理员" ,  referenceNumber:order.order.referenceNumber });
                    }
            } });
        } 
        //创建订单出现其他报错
        else {     
                callback(null , {...result, referenceNumber: order.order.referenceNumber , labelUrl:'' } ) 
              }
    
    } else {
        //创建成功，判断是否是测试方法
        if(order.order.shippingMethodCode === "PK0006"){
            callback(null, { 
                ask: 1 , 
                message: "Success", 
                ...result.data,
                sku:order.declarationArr[0].declareEnName, 
                labelUrl:`http://119.23.188.252/index/get-label/code/${result.data.waybillNumber}` ,
                labelBase64 :''
            });
        } else {
            // image2base64(`http://119.23.188.252/index/get-label/code/${result.data.waybillNumber}`) 
            // .then(
            //     (label) => {
            //         callback(null, { 
            //             ask: 1 , message: "Success", 
            //             ...result.data,
            //             sku:order.declarationArr[0].declareEnName, 
            //             labelUrl:`http://119.23.188.252/index/get-label/code/${result.data.waybillNumber}`,
            //             labelBase64 :label
            //         });
            //     }
            // )
            // .catch(
            //     (error) => {
            //         // throw new Error("no label to convert due to test order")
            //         callback({ask : 0, message: "failed to convert png" ,  referenceNumber:  order.order.referenceNumber });
            //     }
            // )
            callback(null, { 
                ask: 1 , message: "Success", 
                ...result.data,
                sku:order.declarationArr[0].declareEnName, 
                labelUrl:`http://119.23.188.252/index/get-label/code/${result.data.waybillNumber}`
            });
        }
    
    }
    }).catch(err => {
           // console.log(err)
             callback(null, { ask:0 , message: "Interal error"  })
    })
}

const getReceivingExpense = (ref , callback) => {
    request({
        method: 'POST',
        headers: { "content-type": "text/xml"},
        url: 'http://119.23.188.252/default/svc/web-service',
        body: `<?xml version="1.0" encoding="UTF-8"?>\n<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://www.example.org/Ec/">\n\t<SOAP-ENV:Body>\n\t\t<ns1:callService>\n\t\t\t<paramsJson>\n   {"reference_no":"${ref}"}\n            </paramsJson>\t\t\t\n\t\t\t<appToken>895949c155f7dd332d1654e55c013b1f</appToken>\n\t\t\t<appKey>895949c155f7dd332d1654e55c013b1fd3138682d84354dc4b8341decf22b6a7</appKey>\n\t\t\t<service>getReceivingExpense</service>\n\t\t</ns1:callService>\n\t</SOAP-ENV:Body>\n</SOAP-ENV:Envelope>`

     }, (error, response, body) => {
  if (error) {
      callback('Unable to connect server');
  } else if (response.statusCode === 400) {
      callback('Unable to fetch data.');
  } else if (response.statusCode === 200) {
         //response.body.state == undefined && retry > 0 ? resolve(getUspsTracking(id , retry - 1) ) : resolve(response.body.state);
      parseString(response.body, (err, result) => { 
        // let error = result.RateV4Response.Package[0].Error
        // let zoneCode = result.RateV4Response.Package[0].Zone
      callback(null ,  JSON.parse(result['SOAP-ENV:Envelope']["SOAP-ENV:Body"][0]['ns1:callServiceResponse'][0].response[0]))
     })  
    // callback(null , response.body)  
  }
})
}

module.exports ={ createOrder, getReceivingExpense , getLabel ,getTrakcingNumber}