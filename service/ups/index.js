const request = require('request');
const model = require ('../model')

const verifyAddressUPS = (request_chukoula , callback) => {

    let template = {
        ...model.UPSRequestAuth,
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
        ...model.UPSRequestAuth,
            "TrackRequest": { "Request": {
            "RequestOption": "1", 
            "TransactionReference": {
            "CustomerContext": request_chukoula.orderId }
            },
            "InquiryNumber": request_chukoula.trackingNumber }
    }

    let response_template =  {
        orderId : request_chukoula.orderId,
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

module.exports ={ 
    verifyAddressUPS,
    TrackingUPS
}