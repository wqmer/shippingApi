const soap = require('soap');
const config = require('../config')
const path = require('path')
const extend = require('extend')

const request = require('request');
const moment = require('moment')
const USPS = require('usps-webtools');
const parseString = require('xml2js').parseString;



var getUspsZone = (zipcode_pair , callback) => {
    request({
        url: `http://production.shippingapis.com/ShippingAPI.dll?API=RateV4&XML=<RateV4Request USERID="${config.usps.user_id}">
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
        </RateV4Request>`,
        headers: { "content-type": "text/plain"},
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


var getUspsZoneUpdate = (zipcode_pair , callback) => {
    request({
        url: `http://production.shippingapis.com/ShippingAPI.dll?API=RateV4&XML=<RateV4Request USERID="${config.usps.user_id}">
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
        </RateV4Request>`,
        headers: { "content-type": "text/plain"},
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
        error?callback(null ,  { referenceNumber: zipcode_pair.referenceNumber, success:false, description : error[0].Description[0]}):callback( null , { referenceNumber: zipcode_pair.referenceNumber , success:true , zone : zoneCode[0]}) 
     })    
    }
  })
}



// const varifyAddress = (address, callback) => {
//     request({
//         url: `https://secure.shippingapis.com/ShippingAPI.dll?API=Verify&XML=<AddressValidateRequest USERID="${config.usps.user_id}">` +
//         // '<?xml version="1.0" encoding="UTF-8"?>'+
//         '<Address>'+
//         `<Address1>${address.address1}</Address1>` +
//         `<Address2>${address.address2}</Address2>` +
//         `<City>${address.city}</City>` +
//         `<State>${address.state}</State>` +
//         `<Zip5>${address.zipcode}</Zip5>` +
//        `<Zip4></Zip4>` +
//         `</Address>`+
//         `</AddressValidateRequest>`
//      }, (error, response, body) => {
//   if (error) {
//       callback('Unable to connect server');
//   } else if (response.statusCode === 400) {
//       callback('Unable to fetch data.');
//   } else if (response.statusCode === 200) {
//          //response.body.state == undefined && retry > 0 ? resolve(getUspsTracking(id , retry - 1) ) : resolve(response.body.state);
  
//      let myResponse = { 
//         referenceNumber:address.referenceNumber ,
//         status: 'failed',
//         message :'Can not find any address to match',
//         VarifiedAddress: {
//             address1:undefined ,
//             address2: undefined,
//             city: undefined,
//             state: undefined,
//             zipcode: undefined,
//         }
//      }
//      parseString(response.body, (err, result) => { 
//         //  if(result.AddressValidateResponse.Address[0].Error != undefined){
//         //      callback(null, myResponse)
//         //  }
//         //  else {
//         //     myResponse.status = 'success',
//         //     myResponse.message = Array.isArray(result.AddressValidateResponse.Address[0].ReturnText)?result.AddressValidateResponse.Address[0].ReturnText[0]:'Verify address successfully'
//         //     myResponse.VarifiedAddress.address1 = result.AddressValidateResponse.Address[0].Address2[0]
//         //     myResponse.VarifiedAddress.address2 = Array.isArray(result.AddressValidateResponse.Address[0].Address1)?result.AddressValidateResponse.Address[0].Address1[0]:undefined
//         //     myResponse.VarifiedAddress.city = result.AddressValidateResponse.Address[0].City[0]
//         //     myResponse.VarifiedAddress.state = result.AddressValidateResponse.Address[0].State[0]
//         //     myResponse.VarifiedAddress.zipcode = result.AddressValidateResponse.Address[0].Zip5[0]

//         //      callback(null,myResponse )
//         //  }

//         callback(null, result )
//      })     
//    }
//  })
// }

const varifyAddress = (args, callback) => {      
     let myResponse = { 
        referenceNumber:args.referenceNumber ,
        status: 'failed',
        ChineseMessage:'未找到地址 ，UPS对该地址无法投递。',
        message :'Can not find any address to match',
        varifyAddress: {
            address1:undefined ,
            address2: undefined,
            city: undefined,
            state: undefined,
            zipcode: undefined,
        }
     }

    const usps = new USPS({
        server: 'http://production.shippingapis.com/ShippingAPI.dll',
        userId: config.usps.user_id,
        // ttl: 10000 //TTL in milliseconds for request
      });
    
      usps.verify({
        street1: args.address1,
        street2: args.address2,
        city: args.city,
        state: args.state,
        zip: args.zipcode
      }, function(err, result) {
          if(err){myResponse.message = err.Description , callback(null,myResponse)}
          else {
            myResponse.status = 'success'
            myResponse.varifyAddress.address1 = result.street1
            myResponse.varifyAddress.address2 = result.street2
            myResponse.varifyAddress.city = result.city
            myResponse.varifyAddress.zipcode = result.zip
            myResponse.varifyAddress.state = result.state
            
            switch(result.dpv_confirmation) {
                case 'Y':
                  myResponse.message = 'Address was DPV confirmed for both primary and (if present) secondary numbers'
                  myResponse.ChineseMessage = '地址1和地址2全部正确'
                  break;

                case 'D':
                 myResponse.message = 'Address was DPV confirmed for the primary number only, and Secondary number information was missing.'
                 myResponse.ChineseMessage = '地址错误！ 街道和路名正确，门牌号或者公寓号缺失。请检查地址2是否有填写，或者是否填写在正确位置'
                  break;

                case 'S':
                myResponse.message = 'Address was DPV confirmed for the primary number only, and Secondary number information was present but unconfirmed'
                myResponse.ChineseMessage = '地址错误！ 街道和路名正确，门牌号或者公寓号错误。如有地址2，请检查地址2格式是否正确。'
                break;

                case 'N':
                myResponse.message = 'Both Primary and (if present) Secondary number information failed to DPV Confirm'    
                myResponse.ChineseMessage = '地址错误！ 街道名和公寓门牌号都错误。请同时检查地址1和地址2 。 UPS对该地址无法投递'          
                break;
                default:
                  // code block
              }
            callback(null, myResponse);
          }
        
      });














}



module.exports = { 
        varifyAddress,
        getUspsZone,
        getUspsZoneUpdate
}