const request = require('request');
const base64ToImage = require('base64-to-image');
const base64Img = require('base64-img');
const uuid = require('uuid')
const ip = require("ip");


const addSenderAddress = (params, callback) => {
    const opts = {
        headers: { "content-type": "application/json"},
        url: 'https://www.meiyuncang.com/api/UspsDom/AddFromAddress',
        body: JSON.stringify(params)
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
    return new Promise ((resolve , reject) => {  
           const opts = {
                 headers: { "content-type": "application/json"},
                 url: 'https://www.meiyuncang.com/api/UspsDom/Create',
                 body: JSON.stringify(params)
            };   
     request.post(opts, (error, response, body) => {
                 if (error) {
                      resolve({ success: false, message: error.code});
                 } else if (response.statusCode === 400) {
                      resolve('Unable to fetch data.');
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
                   resolve('Unable to fetch data.');
              } else if (response.statusCode === 200) { 
                   resolve(JSON.parse(body))
                }
        })
   })
}

const getLabel = (params , callback) => {
      createOrder_async(params).then(result => {   
        const OrderId = params.OrderId 
        if(result.Msg === "Success"  || result.Msg === "该订单号已存在，无法重复添加！"){

            const opts = {
                headers: { "content-type": "application/json"},
                url: 'https://www.meiyuncang.com/api/UspsDom/GetLabel',
                body: JSON.stringify({
                    "OrderId": params.OrderId,
                    "ApiKey":  params.ApiKey
                  })
           };

            getLabel_async(opts).then( result =>{
              if (result.Code == 0 ){
                   let base64Str = result.Data.Label
                //    console.log(base64Str)
                    let path ='label';
                    let {Weight,FromAddressId,ToName,ToAddress1,ToAddress2,ToCity,ToStateCode,ToPostalCode,ToPhone,ToEmail} = params
                    let dir =  base64Img.imgSync(`data:image/png;base64,${base64Str}`, path , OrderId);
                    delete result.Data.Label
                    result.Data.LabelUrl = "http://" + ip.address()+ "/" + dir
                    
                    callback(null, {...result, Sku: params.RubberStamp1, OrderId, Weight,FromAddressId,ToName,ToAddress1,ToAddress2,ToCity,ToStateCode,ToPostalCode,ToPhone,ToEmail})
              }else {
                    callback(null ,{ success: false, message: result});
              }
            }).catch(err => {
                console.log(err)
                callback(null, { success: false, message: 'internal error'});
            })


            
        //     request.post(opts, (error, response, body) => {
        //         if (error) {
        //                 callback({ success: false, message: error.code});
        //              } else if (response.statusCode === 400) {
        //                 callback('Unable to fetch data.');
        //              } else if (response.statusCode === 200) { 
        //                 let myreponse = JSON.parse(body)
        //                 // console.log(params.OrderId )
        //                 // delete myreponse.Data.Label
        //                 callback(null, {...myreponse, Sku: params.RubberStamp1, OrderId})
        //              }
        //     })


        }else {
            callback(null, {...result, OrderId } )
        }
    }).catch(err => {
        // console.log(err)
          callback(null, { ask:0 , message: "Interal error"  })
    })
}


module.exports = { 
    addSenderAddress ,
    getLabel
    // AddOrderMainToConfirm  
}


