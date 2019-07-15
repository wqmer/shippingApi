const request = require('request');

const addSenderAddress = (params, callback) => {
    const opts = {
        timeout: 25000,
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
                 timeout: 10000,
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

const getLabel = (params , callback) => {
      createOrder_async(params).then(result => {   
        const OrderId = params.OrderId 
        if(result.Msg === "Success"  || result.Msg === "该订单号已存在，无法重复添加！"){

            const opts = {
                timeout: 25000,
                headers: { "content-type": "application/json"},
                url: 'https://www.meiyuncang.com/api/UspsDom/GetLabel',
                body: JSON.stringify({
                    "OrderId": params.OrderId,
                    "ApiKey": params.ApiKey
                  }       )
           };
        
            request.post(opts, (error, response, body) => {
                if (error) {
                        callback({ success: false, message: error.code});
                     } else if (response.statusCode === 400) {
                        callback('Unable to fetch data.');
                     } else if (response.statusCode === 200) { 
                        let myreponse = JSON.parse(body)
                        myreponse.Data.OrderId = params.OrderId
                        callback(null, myreponse)
                     }
            })
        }else {
            callback(null, {...result, OrderId } )
        }
    })
}


module.exports = { 
    addSenderAddress ,
    getLabel
    // AddOrderMainToConfirm  
}


