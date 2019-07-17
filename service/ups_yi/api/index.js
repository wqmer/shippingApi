

const reqeust_obj = (timeout , params , url ) => {
      return  {  
                  timeout,
                  method: 'POST',
                  headers: { "content-type": "application/json"},
                  url,
                  body:   JSON.stringify(params)
                }
}


const request_url = { 
      create_order :    'http://119.23.188.252/api/v1/orders/service/create',
      get_tracking_no : 'http://119.23.188.252/api/v1/orders/service/getTrackingNumber' ,
}





module.exports = { reqeust_obj,   request_url }