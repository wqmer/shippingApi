// detect ups or dhl  =>  primoisfy => post 
const request = require('request');
const Aftership = require('aftership')('23a9737b-d9d7-45c1-851e-f85cb58bbcbc');
const apiKey = "29833628d495d7a5";
const moment = require('moment')
const parseString = require('xml2js').parseString;


const createOrder = (order , callback) =>{
    request({
        method: 'POST',
        headers: { "content-type": "application/json"},
        url:     'http://119.23.188.252/api/v1/orders/service/create',
        body:   JSON.stringify(order)
      }, function(error, response, body){
         let orderId = order.order.referenceNumber
        callback(null, {...JSON.parse(response.body), referenceNumber: orderId });
      }); 
}

const getTrakcingNumber = (order , callback) =>{
    request({
        method: 'POST',
        headers: { "content-type": "application/json"},
        url:     'http://119.23.188.252/api/v1/orders/service/getTrackingNumber',
        body:   JSON.stringify(order)
      }, function(error, response, body){
         let myReponse =  JSON.parse(response.body)
        callback(null, myReponse.data);
      }); 
}


const createOrder_async = (order) =>{
    return new Promise ((resolve , reject) => {
    request({
        timeout: 20000,
        method: 'POST',
        headers: { "content-type": "application/json"},
        url:     'http://119.23.188.252/api/v1/orders/service/create',
        body:   JSON.stringify(order)
      }, function(error, response, body){
          if(error){
            resolve({ask : 0, message: error.code ,  referenceNumber: orderId });
            }
        let orderId = order.order.referenceNumber
        try{
            resolve({...JSON.parse(response.body), referenceNumber: orderId });
        } catch(error) { 
            resolve({ask : 0, message: error ,  referenceNumber: orderId });
        }
      
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


const getLabel = (order, callback) => {
    createOrder_async(order).then( result => {
    if(result.ask == 0 ){
        if (result.message.includes("参考单号已存在")){
            let param = {
                "authorization": {
                "token": order.authorization.token,
                "key":  order.authorization.key
                   },
                "waybillNumber": order.order.referenceNumber
                }
            request({
                     timeout: 10000,
                     method: 'POST',
                     headers: { "content-type": "application/json"},
                     url:  'http://119.23.188.252/api/v1/orders/service/getTrackingNumber',
                     body:   JSON.stringify(param)
                }, function(error, response, body){
                    if(error) callback({ask : 0, message: error.code ,  referenceNumber:  order.order.referenceNumber });
                let myReponse = JSON.parse(  response.body )
                // console.log(myReponse)
             callback(null, { 
                    ask: 1 , message: "Success", 
                    referenceNumber: order.order.referenceNumber ,
                    waybillNumber: myReponse.data.waybillNumber,
                    trackingNumber: myReponse.data.trackingNumber,
                    serverNumber: "",
                    isAsynch: "N",
                    sku:order.declarationArr[0].declareEnName, 
                    labelUrl: `http://119.23.188.252/index/get-label/code/${myReponse.data.waybillNumber}`
                });
            });
       

        }else {     
            callback(null , {...result, referenceNumber: order.order.referenceNumber , labelUrl:'' } ) 
         }
    
    } else {
            callback(null, { 
                ask: 1 , message: "Success", 
                ...result.data,
                sku:order.declarationArr[0].declareEnName, 
                labelUrl:`http://119.23.188.252/index/get-label/code/${result.data.waybillNumber}`
            });
    }
    // console.log(result)
    }).catch(err => callback(null, { ask:0 , message:"Interal error"}))
}

//设定简单地址请求信息
// let requet_example = 
// { 
//     referenceNumber: 'test',
//     address1 :   "test",
//     address2 : "test",
//     city: "123",
//     state:"123",
//     zipcode:"123"
// }

// let  response_example = 
// {   
//      referenceNumber :"213321",
//      status : "success" ,  
//      VarifiedAddress : {
//                  address1 : "test",
//                  address2 : "test",
//                  city: "123",
//                  state:"123",
//                  zipcode:"123"
//               }
// }


// let response_example = 
// {
//     referenceNumber :"213321",
//     status : "failed" , 
//     message :""
//     address : null
// }
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





module.exports ={ createOrder,   getReceivingExpense , getLabel ,getTrakcingNumber}