const soap = require('soap');
const config = require('../config')
const path = require('path')
const extend = require('extend')

const request = require('request');
const moment = require('moment')
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


const varifyAddress = (address, callback) => {
    request({
        url: `https://secure.shippingapis.com/ShippingAPI.dll?API=Verify&XML=<AddressValidateRequest USERID="${config.usps.user_id}">
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
  
     let myResponse = { 
        referenceNumber:address.referenceNumber ,
        status: 'failed',
        message :'Can not find any address to match',
        VarifiedAddress: {
            address1:undefined ,
            address2: undefined,
            city: undefined,
            state: undefined,
            zipcode: undefined,
        }
     }
     parseString(response.body, (err, result) => { 
         if(result.AddressValidateResponse.Address[0].Error != undefined){
             callback(null, myResponse)
         }
         else {
            myResponse.status = 'success',
            myResponse.message = Array.isArray(result.AddressValidateResponse.Address[0].ReturnText)?result.AddressValidateResponse.Address[0].ReturnText[0]:'Verify address successfully'
            myResponse.VarifiedAddress.address1 = result.AddressValidateResponse.Address[0].Address2[0]
            myResponse.VarifiedAddress.address2 = Array.isArray(result.AddressValidateResponse.Address[0].Address1)?result.AddressValidateResponse.Address[0].Address1[0]:undefined
            myResponse.VarifiedAddress.city = result.AddressValidateResponse.Address[0].City[0]
            myResponse.VarifiedAddress.state = result.AddressValidateResponse.Address[0].State[0]
            myResponse.VarifiedAddress.zipcode = result.AddressValidateResponse.Address[0].Zip5[0]

             callback(null,myResponse )
         }
     })     
   }
 })
}

module.exports = { 
        varifyAddress,
        getUspsZone
}