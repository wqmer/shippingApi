const request = require('request');
const md5 = require('md5');
const config = require('../config')
const Timeout = require('await-timeout')
const timer = new Timeout();


const createOrder = (params, callback) => {
    let { appKey , requestDate , languageCode , instructionList} = params 
    let realId
    instructionList[0].RealOrderID ? realId = instructionList[0].RealOrderID : realId = undefined
    delete instructionList[0].RealOrderID
    let request_body = {instructionList}
    let signature =  md5(JSON.stringify(request_body ) + config.usps_mofangyun.appSecret + requestDate);
    // console.log(params)
    const opts = {
        headers: { 
            "content-type": "application/json",
             appKey ,
             signature ,
             requestDate ,
             languageCode
        },
        url: 'http://47.75.131.124:8129/wgs/v1/internationalexpress/createExpressShipments',
        body: JSON.stringify(request_body)
      };
    request.post(opts, (error, response, body) => {
        if (error) {
            callback({ success: false, message: error.code});
        } else if (response.statusCode === 400) {
            callback('Unable to fetch data.');
        } else if (response.statusCode === 200) { 
            callback(null, JSON.parse(body))
        }
    })
}

const getLabel = (params , callback) => {
    let { appKey ,  requestDate , languageCode, instructionList } = params 
    let request_body = {"instructionList":instructionList}
    let signature =  md5(JSON.stringify(request_body ) + config.usps_mofangyun.appSecret + requestDate);

    const opts = {
        headers: { 
            "content-type": "application/json",
             appKey ,
             signature ,
             requestDate ,
             languageCode
        },
        url: 'http://47.75.131.124:8129/wgs/v1/internationalexpress/exprssShipmentTrackingNumbers',
        body: JSON.stringify(request_body)
      };
    
    request.post(opts, (error, response, body) => {
        if (error) {
            callback({ success: false, message: error.code});
        } else if (response.statusCode === 400) {
            callback('Unable to fetch data.');
        } else if (response.statusCode === 200) { 
            callback(null, JSON.parse(body))
        }
    })
}

const createOrder_async = (params) => {
    let { appKey , requestDate , languageCode , instructionList} = params 
    let realId
    instructionList[0].RealOrderID ? realId = instructionList[0].RealOrderID : realId = undefined
    delete instructionList[0].RealOrderID
    let request_body = {instructionList}
    let signature =  md5(JSON.stringify(request_body ) + config.usps_mofangyun.appSecret + requestDate);
    return new Promise ((resolve , reject) => {  
           const opts = {
                 headers: { 
                     "content-type": "application/json" ,
                     appKey ,
                     signature ,
                     requestDate ,
                     languageCode
                },
                 url: 'http://47.75.131.124:8129/wgs/v1/internationalexpress/createExpressShipments',
                 body: JSON.stringify(request_body)
            };   
            request.post(opts, (error, response, body) => {
                // let mybody = {}
                 if (error) {
                      resolve({ success: false, message: error.code});
                 } else if (response.statusCode === 400) {
                      resolve(JSON.parse(response.body));
                 } else if (response.statusCode === 200) { 
                      resolve(JSON.parse(body))
                }
           })
     })
}


const getLabel_async = (opts) => { 
      return new Promise ((resolve , reject) => {  
         request.post(opts, (error, response, body) => {
              if (error) {
                   reject({ success: false, message: error.code});
              } else if (response.statusCode === 400) {
                   resolve(JSON.parse(response.body));
              } else if (response.statusCode === 200) { 
                   resolve(JSON.parse(body))
            }
        })
   })
}

const getOrder_async = (params , callback ) => {  
      let { appKey ,  requestDate , languageCode, instructionList } = params 
      let realId

      instructionList[0].RealOrderID ? realId = instructionList[0].RealOrderID : realId = undefined
      createOrder_async(params).then(result => {
            //    console.log(result)
               if(result.instructionList){     
                  if(result.instructionList[0].succeed ){      
                    // console.log(config.usps_mofangyun.appSecret) 
                     let request_body = {"instructionList":[{"userOrderNumber":result.instructionList[0].userOrderNumber}]}
                     let signature =  md5(JSON.stringify(request_body ) + config.usps_mofangyun.appSecret + requestDate);
                    //  console.log(signature)
                     const opts = {
                           headers: { 
                              "content-type": "application/json",
                               appKey ,
                               signature ,
                               requestDate ,
                               languageCode
                        },
                        url: 'http://47.75.131.124:8129/wgs/v1/internationalexpress/exprssShipmentTrackingNumbers',
                        body: JSON.stringify(request_body)
                      };

                        // timer.set(3000).then(() =>  
                        getLabel_async(opts).then(result => { 
                    

                       let {
                            succeed,
                            errorCode,
                            errorMessage,
                            userOrderNumber,
                            instructionNumber,
                            failReason,
                            mainTrackingNumber,
                            shipments
                          } = result.instructionList[0]

                        result.instructionList[0] = {
                            // succeed,
                            // errorCode,
                            // errorMessage,
                            userOrderNumber,
                            "RealOrderID" : realId,
                            "Sku": "Sku",
                            "Sname": instructionList[0].recipient.contactName,
                            "Sadd1": instructionList[0].recipient.street,
                            "Sadd2": instructionList[0].recipient.street1,
                            "Scity": instructionList[0].recipient.city,
                            "Sstate": instructionList[0].recipient.state,
                            "Spostcode": instructionList[0].recipient.zipCode,
                            "Stel": instructionList[0].recipient.telephone, 

                            "Fname": instructionList[0].sender.contactName,
                            "Ftel":  instructionList[0].sender.telephone,
                            "Fadd1": instructionList[0].sender.street,
                            "Fadd2": instructionList[0].sender.street1,
                            "Fstate": instructionList[0].sender.state,
                            "Fcity": instructionList[0].sender.city,
                            "Fpostcode": instructionList[0].sender.zipCode,
                            "Weight": instructionList[0].packageDetailList[0].packageRecord.weight,
                            "Fcountry": "US",
                            "Method": instructionList[0].channelCode,
                            instructionNumber,
                            failReason,
                            mainTrackingNumber,
                            shipments
                          } 

                        //   "RealOrderID": "123",
                        //   "Sku": "Sku",
                        //   "Sname": "收货人",
                        //   "Sadd1": "收货地址1",
                        //   "Sadd2": "收货地址2",
                        //   "Scity": "收货城市",
                        //   "Sstate": "收货州",
                        //   "Spostcode": "收货邮编",
                        //   "Stel": "收货电话",

                        //   "Fname": "发货人",
                        //   "Ftel": "发货电话",
                        //   "Fadd1": "发货地址",
                        //   "Fstate": "发货州",
                        //   "Fcity": "发货城市",
                        //   "Fpostcode": "发货邮编",
                        //   "Weight": "打单重量",
                        //   "Fcountry": "1234",

                        // "instructionList": [
                        //     {
                        //         "channelCode": "SmartPost",
                        //         "userOrderNumber":  "123",
                        //         "RealOrderID":"123",
                        //         "remark": "",
                        //         "sender": {
                        //             "contactName": "NC",
                        //             "telephone": "5412545474",
                        //             "countryCode": "US",
                        //             "state": "NC",
                        //             "city": "Raleigh",
                        //             "street": "2434 Bertie Drive",
                        //             "street1": "",
                        //             "street2": "",
                        //             "county": "",
                        //             "zipCode": "27610",
                        //             "zip4": ""
                        //         },
                        //         "recipient": {
                        //             "contactName": "Lisa Thompson",
                        //             "telephone": "6627926425",
                        //             "countryCode": "US",
                        //             "state": "MI",
                        //             "city": "Wyoming",
                        //             "street": "1027 Golfcrest Dr SW",
                        //             "street1": "",
                        //             "street2": "",
                        //             "county": "",
                        //             "zipCode": "49509",
                        //             "zip4": "9573"
                        //         },
      
                        callback(null,result) }).catch(error => callback (null , { success: false, message: 'internal error'})  )
                        // );                  
                   }else{
                       callback( null , result.instructionList[0].errorMessage )
                   }
                }else {
                   callback(null, result)
                }
       }).catch(error => callback (null , error)  )
}


module.exports = { 
    createOrder ,
    getLabel,
    getOrder_async,
   
    // AddOrderMainToConfirm  
}
