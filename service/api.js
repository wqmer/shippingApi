// detect ups or dhl  =>  primoisfy => post 
const xto = require("xto");
const request = require('request');
const Aftership = require('aftership')('23a9737b-d9d7-45c1-851e-f85cb58bbcbc');
const apiKey ="29833628d495d7a5";
const moment = require('moment')
const parseString = require('xml2js').parseString;


var createOrder = (order , callback) =>{
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


var getUspsZone = (zipcode_pair , callback) => {
           request({
               url: `http://production.shippingapis.com/ShippingAPI.dll?API=RateV4&XML=<RateV4Request USERID="849XUEHU5746">
               <Revision>2</Revision>
               <Package ID="1ST">
               <Service>PRIORITY</Service>
               <ZipOrigination>${zipcode_pair.from}</ZipOrigination>
               <ZipDestination>${zipcode_pair.to}</ZipDestination>
               <Pounds>0</Pounds>
               <Ounces>3.5</Ounces>
               <Container>VARIABLE</Container>
               <Size>REGULAR</Size>
               <Machinable>true</Machinable>
               <DropOffTime>08:00</DropOffTime>
               <ShipDate>${moment().format('L')}</ShipDate>
               </Package>
               </RateV4Request>`
            }, (error, response, body) => {
         if (error) {
             callback('Unable to connect server');
         } else if (response.statusCode === 400) {
             callback('Unable to fetch data.');
         } else if (response.statusCode === 200) {
                //response.body.state == undefined && retry > 0 ? resolve(getUspsTracking(id , retry - 1) ) : resolve(response.body.state);
            
            parseString(response.body, (err, result) => { 
               let error = result.RateV4Response.Package[0].Error
               let zoneCode = result.RateV4Response.Package[0].Zone
               error?callback(null ,  { success:false, description : error[0].Description[0]}):callback( null , { success:true , zone : zoneCode[0]}) 
            })    
        }
    })
}


// var getUspsZone = (ZipCodeFrom, ZipCodeTo) => {
//     return new Promise ((resolve , reject) => {
//            request({
//                url: `http://production.shippingapis.com/ShippingAPI.dll?API=RateV4&XML=<RateV4Request USERID="849XUEHU5746">
//                <Revision>2</Revision>
//                <Package ID="1ST">
//                <Service>PRIORITY</Service>
//                <ZipOrigination>${ZipCodeFrom}</ZipOrigination>
//                <ZipDestination>${ZipCodeTo}</ZipDestination>
//                <Pounds>0</Pounds>
//                <Ounces>3.5</Ounces>
//                <Container>VARIABLE</Container>
//                <Size>REGULAR</Size>
//                <Machinable>true</Machinable>
//                <DropOffTime>08:00</DropOffTime>
//                <ShipDate>${moment().format('L')}</ShipDate>
//                </Package>
//                </RateV4Request>`
//             }, (error, response, body) => {
//          if (error) {
//              reject('Unable to connect server');
//          } else if (response.statusCode === 400) {
//              reject('Unable to fetch data.');
//          } else if (response.statusCode === 200) {
//                 //response.body.state == undefined && retry > 0 ? resolve(getUspsTracking(id , retry - 1) ) : resolve(response.body.state);
//                 resolve(response.body);
//                }
//        })
//  })
// }


// var getScanForm = () => {
//     return new Promise ((resolve , reject) => {
//            request({
//                url: `https://secure.shippingapis.com/ShippingAPI.dll?API=SCAN&XML=<SCANRequest USERID="849XUEHU5746">
//                 <Option>
//                 <Form>5630</Form>
//                 </Option>
//                 <FromName>Kimi</FromName>
//                 <FromFirm>United States Postal Service</FromFirm>
//                 <FromAddress1></FromAddress1>
//                 <FromAddress2>1 league 62531</FromAddress2>
//                 <FromCity>Irvine</FromCity>
//                 <FromState>CA</FromState>
//                 <FromZip5>92602</FromZip5>
//                 <FromZip4>1234</FromZip4>
//                 <Shipment>
//                 <PackageDetail>
//                 <PkgBarcode>9405809699937350155368</PkgBarcode>
//                 </PackageDetail>
//                 </Shipment>
//                 <MailDate>20190306</MailDate>
//                 <MailTime>100502</MailTime>
//                 <ImageType>TIF</ImageType>
//                 </SCANRequest>`
//             }, (error, response, body) => {
//          if (error) {
//              reject('Unable to connect server');
//          } else if (response.statusCode === 400) {
//              reject('Unable to fetch data.');
//          } else if (response.statusCode === 200) {
//                 //response.body.state == undefined && retry > 0 ? resolve(getUspsTracking(id , retry - 1) ) : resolve(response.body.state);
//                 resolve(response.body);
//                }
//             })
//        })
// }



// var varifyAddress = () => {
//     return new Promise ((resolve , reject) => {
//            request({
//                url:  `https://secure.shippingapis.com/ShippingAPI.dll?API=Verify&XML=<AddressValidateRequest USERID="849XUEHU5746">
//                <Address>
//                <Address1>5802 Canonbury Court</Address1> 
//                <Address2></Address2> 
//                <City>Spotsylvania</City> 
//                <State>Virginia</State> 
//                <Zip5>22553</Zip5> 
//                <Zip4></Zip4> 
//                </Address>
//                </AddressValidateRequest>`
//             }, (error, response, body) => {
//          if (error) {
//              reject('Unable to connect server');
//          } else if (response.statusCode === 400) {
//              reject('Unable to fetch data.');
//          } else if (response.statusCode === 200) {
//                 //response.body.state == undefined && retry > 0 ? resolve(getUspsTracking(id , retry - 1) ) : resolve(response.body.state);
//                 resolve(response.body);
//                }
//             })
//        })
// }

var varifyAddress = (address, callback) => {
    request({
        url: `https://secure.shippingapis.com/ShippingAPI.dll?API=Verify&XML=<AddressValidateRequest USERID="849XUEHU5746">
        <Address>
        <Address1>${address.address1}</Address1> 
        <Address2>${address.address2}</Address2> 
        <City>${address.city}</City> 
        <State>${address.state}</State> 
        <Zip5>${address.zipcode}</Zip5> 
        <Zip4></Zip4> 
        </Address>
        </AddressValidateRequest>`
     }, (error, response, body) => {
  if (error) {
      callback('Unable to connect server');
  } else if (response.statusCode === 400) {
      callback('Unable to fetch data.');
  } else if (response.statusCode === 200) {
         //response.body.state == undefined && retry > 0 ? resolve(getUspsTracking(id , retry - 1) ) : resolve(response.body.state);
     callback(null , response.body)
    //  parseString(response.body, (err, result) => { 
    //     let error = result.RateV4Response.Package[0].Error
    //     let zoneCode = result.RateV4Response.Package[0].Zone
    //     error?callback(null ,  { success:false, description : error[0].Description[0]}):callback( null , { success:true , zone : zoneCode[0]}) 
    //  })    
 }
})
}



var getUspsTracking = (id, retry = 3 ) => { 
    return new Promise (( resolve ,reject ) => {
           request({
                    url: `http://api.kuaidi100.com/api?id=${apiKey}&com=usps&nu=${id}&valicode=[]&show=0&muti=1&order=asc`,
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
                       url: `http://api.kuaidi100.com/api?id=${apiKey}&com=dhlen&nu=${id}&valicode=[]&show=0&muti=1&order=asc`,
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



var testSelf = (id) => { 
    return new Promise (( resolve ,reject ) => {
           request(  {
                       url: `http://127.0.0.1:3000/trackings/${id}`,
                       json: true
                  }, (error, response, body) => {
         
           if (error) {
                     reject('Unable to connect server');
           } else if (response.statusCode === 400) {
                     reject('Unable to fetch data.');
           } else if (response.statusCode === 200) {
                     resolve(response.body);
                   }
         })
    })                      

}














module.exports ={getUspsZone, getUspsTracking, getDhlTracking, detectCarrier, testSelf, createOrder, varifyAddress}