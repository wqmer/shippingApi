const request = require('request');
const md5 = require('md5');
const config = require('../config')
const Timeout = require('await-timeout')
const timer = new Timeout();


const createOrder = (params, callback) => {
    let { appKey , signature , requestDate , languageCode , instructionList} = params 
    const opts = {
        headers: { 
            "content-type": "application/json",
             appKey ,
             signature ,
             requestDate ,
             languageCode
        },
        url: 'http://47.75.131.124:8129/wgs/v1/internationalexpress/createExpressShipments',
        body: JSON.stringify({instructionList})
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

const getOrder = (params , callback) => {
    const opts = {
        headers: { 
            "content-type": "application/json",
             appKey ,
             signature ,
             requestDate ,
             languageCode
        },
        url: 'http://47.75.131.124:8129/wgs/v1/internationalexpress/exprssShipmentTrackingNumbers',
        body: JSON.stringify({instructionList})
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
      let { appKey ,  requestDate , languageCode,instructionList} = params 
      let realId
      instructionList[0].RealOrderID ? realId = instructionList[0].RealOrderID : realId = undefined
      createOrder_async(params).then(result => {
            //    console.log(result)
               if(result.instructionList){
                    // console.log ('test')
                  if(result.instructionList[0].succeed ){      
                    // console.log ('test')      
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
                        console.log(result)

                       let {
                            succeed,
                            errorCode,
                            errorMessage,
                            userOrderNumber,
                            instructionNumber,
                            failReason,
                            mainTrackingNumber,
                            shipments
                          } 
                          = result.instructionList[0]
                        // let myresult =  {
                            


                        // }
                        result.instructionList[0] = {
                            succeed,
                            errorCode,
                            errorMessage,
                            userOrderNumber,
                            "RealOrderID" : realId,
                            instructionNumber,
                            failReason,
                            mainTrackingNumber,
                            shipments
                          } 
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
    getOrder_async
    // AddOrderMainToConfirm  
}
