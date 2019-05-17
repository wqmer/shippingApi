const request = require('request');
const config = require('../config')
const Aftership = require('aftership')(config.Aftership.apiKey);



var getUspsTracking = (id, retry = 3 ) => { 
    return new Promise (( resolve ,reject ) => {
           request({
                    url: `http://api.kuaidi100.com/api?id=${config.kuaidi365.apiKey}&com=usps&nu=${id}&valicode=[]&show=0&muti=1&order=asc`,
                    json: true
                  }, (error, response, body) => {
           if (error) {
                     reject('Unable to connect server');
           } else if (response.statusCode === 400) {
                     reject('Unable to fetch data.');
           } else if (response.statusCode === 200) {
                      response.body.state == undefined && retry > 0 ? resolve(getUspsTracking(id , retry - 1) ) : resolve(response.body.state);
                   }
         })
    })                      
}


var getDhlTracking = ( id, retry = 3) => { 
    return new Promise (( resolve ,reject ) => {
           request(  {
                       url: `http://api.kuaidi100.com/api?id=${config.kuaidi365.apiKey}&com=dhlen&nu=${id}&valicode=[]&show=0&muti=1&order=asc`,
                       json: true
                  }, (error, response, body) => {
           if (error) {
                     reject('Unable to connect server');
           } else if (response.statusCode === 400) {
                     reject('Unable to fetch data.');
           } else if (response.statusCode === 200) {
                      response.body.state == undefined && retry > 0 ? resolve(getDhlTracking(id , retry - 1) ) : resolve(response.body.state);
                   }
         })
    })                      
}


var detectCarrier = ( id ) => {
       let body = {
                 'tracking': {
                     'tracking_number': id,
                     'slug': ['dhl', 'usps' ,'ups' ,'fedex' ,'sf-express']
                 }
             };

       return new Promise (( resolve ,reject) => {
             Aftership.call('POST', '/couriers/detect', {
              body: body
              }, function (err, result) {
                  if(err) {
                           resolve('undefined')
                    } 
                  else {
                         var couriers = result.data.couriers[0] == undefined ? 'usps' : result.data.couriers[0].slug
                           resolve(couriers)
                  }
              });   
        })    
}


module.exports ={ 
    getUspsTracking, getDhlTracking, detectCarrier
}