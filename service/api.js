// detect ups or dhl  =>  primoisfy => post 
const xto = require("xto");
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
        method: 'POST',
        headers: { "content-type": "application/json"},
        url:     'http://119.23.188.252/api/v1/orders/service/create',
        body:   JSON.stringify(order)
      }, function(error, response, body){
          if(error){
              reject(error)
            }
        let orderId = order.order.referenceNumber
        resolve({...JSON.parse(response.body), referenceNumber: orderId });
      }); 
    })
}


const getLabel = (order, callback) => {
    createOrder_async(order).then( result => {
    if(result.ask == 0){
        callback(null , {...result, referenceNumber: order.order.referenceNumber , labelUrl:'' } )
    } else {
        let param = {
            "authorization": {
            "token": order.authorization.token,
            "key":  order.authorization.key
               },
            "waybillNumber": result.data.waybillNumber
            }
        request({
                 method: 'POST',
                 headers: { "content-type": "application/json"},
                 url:   'http://119.23.188.252/api/v1/orders/service/getLabel',
                 body:   JSON.stringify(param)
            }, function(error, response, body){
                let myReponse = JSON.parse(  response.body )
                // callback(null, response.body)
            callback(null, { ask: 1 , message: "Success", ...result.data, sku:order.declarationArr[0].declareEnName, labelUrl:myReponse.data?myReponse.data.url:'' });
        });     
    }
    // console.log(result)
    })
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




var verifyAddressUPS = (request_chukoula , callback) =>{
    let template = {
        "UPSSecurity": {
        "UsernameToken": {
        "Username": "Ebuysinotrans", "Password": "14113Cerritos"
        }, "ServiceAccessToken": {
        "AccessLicenseNumber": "3D49FA354B0943B8" }
        }, "XAVRequest": {
        "Request": {
        "RequestOption": "1", 
        "TransactionReference": {
        "CustomerContext": `${request_chukoula.referenceNumber}` }
        },
        "MaximumListSize": "10", 
        "AddressKeyFormat": {
        "ConsigneeName": "Consignee Name", 
        "BuildingName": "Building Name",
        "AddressLine": [`${request_chukoula.address1}`,`${request_chukoula.address2}`],
        "PoliticalDivision2": `${request_chukoula.city}`, 
        "PoliticalDivision1": `${request_chukoula.state}`, 
        "PostcodePrimaryLow": `${request_chukoula.zipcode}`, 
        "CountryCode": "US"
        } }
    }

    let response_template =  {
        referenceNumber : request_chukoula.referenceNumber,
        status : "failed" , 
        message:'',
        VarifiedAddress : {
            address1  : undefined,
            address2 : undefined,
            city : undefined,
            state : undefined,
            zipcode : undefined,
        },
       
     }
    
    request({
        method: 'POST',
        headers: { "content-type": "application/json"},
        url:    'https://onlinetools.ups.com/rest/XAV',
        body:   JSON.stringify(template )
      }, function(error, response, body){
          let myReponse =  JSON.parse(response.body)
        //   callback(null, myReponse)

        if(error ){
           response_template.message = error
           callback(null, response_template)

        } else if(myReponse.XAVResponse.Candidate == undefined){
            response_template.message = 'Can not find any address to match'
            callback(null, response_template)
        } else {
            response_template.message = 'Return a vaild address'
            let record = undefined
            Array.isArray(myReponse.XAVResponse.Candidate) ? record = myReponse.XAVResponse.Candidate[0]: record = myReponse.XAVResponse.Candidate
            response_template.status = 'success'
            response_template.VarifiedAddress.address1 = Array.isArray(record.AddressKeyFormat.AddressLine)? record.AddressKeyFormat.AddressLine[0]:record.AddressKeyFormat.AddressLine
            response_template.VarifiedAddress.address2 = Array.isArray(record.AddressKeyFormat.AddressLine)? record.AddressKeyFormat.AddressLine[1]:''
            response_template.VarifiedAddress.zipcode = record.AddressKeyFormat.PostcodePrimaryLow +"-"+ record.AddressKeyFormat.PostcodeExtendedLow
            response_template.VarifiedAddress.city = record.AddressKeyFormat.PoliticalDivision2
            response_template.VarifiedAddress.state = record.AddressKeyFormat.PoliticalDivision1
            callback(null,  response_template)
        }
    
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
               <ShipDate>${moment().add(1,'days').format('L')}</ShipDate>
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
     
    //  parseString(response.body, (err, result) => { 
    //     let error = result.RateV4Response.Package[0].Error
    //     let zoneCode = result.RateV4Response.Package[0].Zone
    //     error?callback(null ,  { success:false, description : error[0].Description[0]}):callback( null , { success:true , zone : zoneCode[0]}) 
    //  })  

      parseString(response.body, (err, result) => { 
        // let error = result.RateV4Response.Package[0].Error
        // let zoneCode = result.RateV4Response.Package[0].Zone
      callback(null ,  JSON.parse(result['SOAP-ENV:Envelope']["SOAP-ENV:Body"][0]['ns1:callServiceResponse'][0].response[0]))
     })  
    // callback(null , response.body)  
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














module.exports ={getUspsZone, getUspsTracking, getDhlTracking, detectCarrier, testSelf, createOrder, varifyAddress , verifyAddressUPS , getReceivingExpense , getLabel ,getTrakcingNumber}