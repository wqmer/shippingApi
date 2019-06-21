const request = require('request');


const createOrder = (order , callback) =>{
    request({
        method: 'POST',
        headers: { "content-type": "application/json" },
        url:    'http://121.41.114.118:8181/action/interface.api.php',
        body:   JSON.stringify(order)
      }, function(error, response, body){
        //  let orderId = order.order.referenceNumber
        // console.log(response.body)
        s = response.body.substr(1);
        // console.log(typeof(response.body))
        // let myresponse = JSON.parse(response.body)
        // let myresponse = response.body
        callback(null, JSON.parse(s));
      }); 
}


module.exports = { createOrder }