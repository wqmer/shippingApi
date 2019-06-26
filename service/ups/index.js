const request = require('request');
const uility = require ('./uility')
const moment = require('moment')

const verifyAddressUPS = (request_chukoula , callback) => {

    let template = {
        ...uility.UPSRequestAuth,
        "XAVRequest": {
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
        deliverable :'false' ,
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
        response_template.deliverable = 'true'
        response_template.message = 'Verify address successfully'
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


const TrackingUPS = (request_chukoula , callback) => {
    let template = {
        ...uility.UPSRequestAuth,
            "TrackRequest": { "Request": {
            "RequestOption": "1", 
            "TransactionReference": {
            "CustomerContext": request_chukoula.orderId }
            },
            "InquiryNumber": request_chukoula.trackingNumber }
    }

    let response_template =  {
        orderId : request_chukoula.orderId,
        trackingNo:request_chukoula.trackingNumber,
        status : "failed" , 
        message:'',
        data : { 
                 
        }
      
     }
    request({
        method: 'POST',
        headers: { "content-type": "application/json"},
        url:    'https://onlinetools.ups.com/rest/Track',
        body:   JSON.stringify(template)
      }, function(error, response, body){
          let myReponse =  JSON.parse(response.body)
        //   callback(null, myReponse)
    
        if(error){
            response_template.message = error
            callback(null, response_template) 
        } else if(myReponse.Fault){
            response_template.message = myReponse.Fault.detail.Errors.ErrorDetail.PrimaryErrorCode.Description
            callback(null,  response_template)
        } else if( myReponse.TrackResponse.Response.ResponseStatus.Code == "1"  ){ 
            response_template.status = 'success',
            response_template.message = 'correct query'
            delete myReponse.TrackResponse.Shipment.Package.ReferenceNumber
            response_template.data = myReponse.TrackResponse.Shipment.Package
            callback(null, response_template)
        }
      }); 
    }
 
const GetUpsInTransitTime = (postcode_pairs,  callback) => {

        let template = {
            ...uility.UPSRequestAuth,
  "TimeInTransitRequest": {
        "Request": {
            "RequestOption": "TNT",
            "TransactionReference": {
                "CustomerContext": "",
                "TransactionIdentifier": ""
            }
        },
        "ShipFrom": {
            "Address": {
                "StateProvinceCode": "StateProvinceCode",
                "CountryCode": "US",
                "PostalCode": postcode_pairs.from
            }
        },
        "ShipTo": {
            "Address": {
                "StateProvinceCode": "StateProvinceCode",
                "CountryCode": "US",
                "PostalCode": postcode_pairs.to
            }
        },
        "Pickup": {
            "Date": moment().format('YYYYMMDD')
        },
        "ShipmentWeight": {
            "UnitOfMeasurement": {
                "Code": "LBS",
                "Description": "Description"
            },
            "Weight": "1"
        },
        "MaximumListSize": "5"
    }
        }
    
        let response_template =  {
            // orderId : request_chukoula.orderId,
            // trackingNo:request_chukoula.trackingNumber,
            status : "failed" , 
            message:'',
            data : { 
          
            }
         }

         request({
            method: 'POST',
            headers: { "content-type": "application/json"},
            url:    'https://onlinetools.ups.com/rest/TimeInTransit',
            body:   JSON.stringify(template)
          }, function(error, response, body){
              let myReponse =  JSON.parse(response.body)
            //   callback(null, myReponse)
        
            if(error){
                response_template.message = error
                callback(null, response_template) 
            } else if(myReponse.Fault){
                response_template.message = myReponse.Fault.detail.Errors.ErrorDetail.PrimaryErrorCode.Description
                callback(null,  response_template)
            } else if( myReponse.TimeInTransitResponse.Response.ResponseStatus.Code == "1"   ){ 
           
               if(myReponse.TimeInTransitResponse.hasOwnProperty('TransitResponse')){
                let serivceList = myReponse.TimeInTransitResponse.TransitResponse.ServiceSummary
                response_template.status = 'success',
                response_template.message = 'correct query'
                // delete myReponse.TrackResponse.Shipment.Package.ReferenceNumber

           
                let getGoundInTransit = serivceList.find(item => item.Service.Code == "GND")
                // console.log(getGoundInTransit)
                response_template.data = {
                    'UPS 2nd day air' :  "2 busniess days" ,
                    'UPS next day air' : "1 busniess day" ,
                    'UPS Ground' : getGoundInTransit.EstimatedArrival.BusinessDaysInTransit + " business days"
                }
                callback(null, response_template)        
               } else {
                response_template.message = 'no service found , check your input'
                callback(null, response_template)       
               }
            }
          }); 





}

    const GetUpsTrackingStatus = (trackingNumber , callback) => {
        let template = {
            ...uility.UPSRequestAuth,
                "TrackRequest": { "Request": {
                "RequestOption": "1", 
                "TransactionReference": {
                "CustomerContext": trackingNumber }
                },
                "InquiryNumber": trackingNumber }
        }
    
        let response_template =  {
            trackingNo:trackingNumber,
            status : "no information" ,       
         }
        request({
            method: 'POST',
            headers: { "content-type": "application/json"},
            url:    'https://onlinetools.ups.com/rest/Track',
            body:   JSON.stringify(template)
          }, function(error, response, body){
              let myReponse =  JSON.parse(response.body)
            //   callback(null, myReponse)
        
            if(error){
                response_template.message = error
                callback(null, response_template) 
            } else if(myReponse.Fault){
                callback(null,  response_template)
            } else if( myReponse.TrackResponse.Response.ResponseStatus.Code == "1"  ){ 
                 let info = myReponse.TrackResponse.Shipment.Package
                if( Array.isArray(info.Activity)){
                    info.Activity[0].Status.Description == 'Delivered'?response_template.status = 'delivered':
                    response_template.status = 'in transit'
                    callback(null, response_template)
                }else {
                    response_template.status = 'created'
                    callback(null, response_template)
                //   info.Activity.Status.Description == 'Order Processed: Ready for UPS'?
                }
 
            }
          }); 
        }


module.exports ={ 
    verifyAddressUPS,
    TrackingUPS,
    GetUpsInTransitTime,
    GetUpsTrackingStatus,
}