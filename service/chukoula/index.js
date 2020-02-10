const request = require('request');


const createOrder = (order, callback) => {
  request({
    method: 'POST',
    headers: { "content-type": "application/json" },
    url: 'http://test.chukou.la/action/interface.api.php',
    body: JSON.stringify(order)
  }, function (error, response, body) {
    //  let orderId = order.order.referenceNumber
    // console.log(response.body)
    try {
      s = response.body.substr(1);
      // let myresponse = response.body
      callback(null, JSON.parse(s));
    } catch (error) {
      callback(null, { "code": 505, "message": "server disconnect" });
    }
  });
}



module.exports = {
  createOrder
}