const request = require('request');
const uility = require('./uility')
const moment = require('moment')
const usps = require('../usps')
const rp = require('request-promise');
const _ = require('lodash')


const verifyAddressUPS = (request_chukoula, callback) => {
    let template = {
        ...uility.UPSRequestAuth,
        "XAVRequest": {
            "Request": {
                "RequestOption": "1",
                "TransactionReference": {
                    "CustomerContext": `${request_chukoula.referenceNumber}`
                }
            },
            "MaximumListSize": "10",
            "AddressKeyFormat": {
                "ConsigneeName": "Consignee Name",
                "BuildingName": "Building Name",
                "AddressLine": [`${request_chukoula.address1}`, `${request_chukoula.address2}`],
                "PoliticalDivision2": `${request_chukoula.city}`,
                "PoliticalDivision1": `${request_chukoula.state}`,
                "PostcodePrimaryLow": `${request_chukoula.zipcode}`,
                "CountryCode": "US"
            }
        }
    }


    let response_template = {
        referenceNumber: request_chukoula.referenceNumber,
        status: "failed",
        deliverable: 'false',
        message: '',
        VarifiedAddress: {
            address1: undefined,
            address2: undefined,
            city: undefined,
            state: undefined,
            zipcode: undefined,
        },

    }

    request({
        method: 'POST',
        headers: { "content-type": "application/json" },
        url: 'https://onlinetools.ups.com/rest/XAV',
        body: JSON.stringify(template)
    }, function (error, response, body) {
        let myReponse = JSON.parse(response.body)
        //   callback(null, myReponse)

        if (error) {
            response_template.message = error
            callback(null, response_template)

        } else if (myReponse.XAVResponse.Candidate == undefined) {
            response_template.message = 'Can not find any address to match'

            callback(null, response_template)
        } else {
            response_template.deliverable = 'true'
            response_template.message = 'Verify address successfully'
            let record = undefined
            Array.isArray(myReponse.XAVResponse.Candidate) ? record = myReponse.XAVResponse.Candidate[0] : record = myReponse.XAVResponse.Candidate
            response_template.status = 'success'
            response_template.VarifiedAddress.address1 = Array.isArray(record.AddressKeyFormat.AddressLine) ? record.AddressKeyFormat.AddressLine[0] : record.AddressKeyFormat.AddressLine
            response_template.VarifiedAddress.address2 = Array.isArray(record.AddressKeyFormat.AddressLine) ? record.AddressKeyFormat.AddressLine[1] : ''
            response_template.VarifiedAddress.zipcode = record.AddressKeyFormat.PostcodePrimaryLow + "-" + record.AddressKeyFormat.PostcodeExtendedLow
            response_template.VarifiedAddress.city = record.AddressKeyFormat.PoliticalDivision2
            response_template.VarifiedAddress.state = record.AddressKeyFormat.PoliticalDivision1
            callback(null, response_template)
        }
    });
}

const TrackingUPS = (request_chukoula, callback) => {
    let template = {
        ...uility.UPSRequestAuth,
        "TrackRequest": {
            "Request": {
                "RequestOption": "1",
                "TransactionReference": {
                    "CustomerContext": request_chukoula.orderId
                }
            },
            "InquiryNumber": request_chukoula.trackingNumber
        }
    }

    let response_template = {
        orderId: request_chukoula.orderId,
        trackingNo: request_chukoula.trackingNumber,
        status: "failed",
        message: '',
        data: {
        }
    }
    request({
        method: 'POST',
        headers: { "content-type": "application/json" },
        url: 'https://onlinetools.ups.com/rest/Track',
        body: JSON.stringify(template)
    }, function (error, response, body) {
        console.log(request_chukoula.trackingNumber)
        let myReponse = JSON.parse(response.body)
        if (error) {
            response_template.message = error
            callback(null, response_template)
        } else if (myReponse.Fault) {
            response_template.message = myReponse.Fault.detail.Errors.ErrorDetail.PrimaryErrorCode.Description
            callback(null, response_template)
        } else if (myReponse.TrackResponse.Response.ResponseStatus.Code == "1") {
            response_template.status = 'success',
                response_template.message = 'correct query'
            delete myReponse.TrackResponse.Shipment.Package.ReferenceNumber
            response_template.data = myReponse.TrackResponse.Shipment.Package
            callback(null, response_template)
        }
    });
}

const GetUpsInTransitTime = (postcode_pairs, callback) => {

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

    let response_template = {
        // orderId : request_chukoula.orderId,
        // trackingNo:request_chukoula.trackingNumber,
        status: "failed",
        message: '',
        data: {

        }
    }


    try {
        request({
            method: 'POST',
            headers: { "content-type": "application/json" },
            url: 'https://onlinetools.ups.com/rest/TimeInTransit',
            body: JSON.stringify(template)
        }, function (error, response, body) {

            let myReponse = JSON.parse(response.body)
            //   callback(null, myReponse)

            if (error) {
                response_template.message = error
                callback(null, response_template)
            } else if (myReponse.Fault) {
                response_template.message = myReponse.Fault.detail.Errors.ErrorDetail.PrimaryErrorCode.Description
                callback(null, response_template)
            } else if (myReponse.TimeInTransitResponse.Response.ResponseStatus.Code == "1") {

                if (myReponse.TimeInTransitResponse.hasOwnProperty('TransitResponse')) {
                    let serivceList = myReponse.TimeInTransitResponse.TransitResponse.ServiceSummary
                    response_template.status = 'success',
                        response_template.message = 'correct query'
                    // delete myReponse.TrackResponse.Shipment.Package.ReferenceNumber


                    let getGoundInTransit = serivceList.find(item => item.Service.Code == "GND")
                    // console.log(getGoundInTransit)
                    response_template.data = {
                        'UPS 2nd day air': "2 busniess days",
                        'UPS next day air': "1 busniess day",
                        'UPS Ground': getGoundInTransit.EstimatedArrival.BusinessDaysInTransit + " business days"
                    }
                    callback(null, response_template)
                } else {
                    response_template.message = 'no service found , check your input'
                    callback(null, response_template)
                }
            }
        });
    } catch (e) {
        callback(null, { "code": 500, "message": "internal error" })
    }

}

const GetUpsTrackingStatus = (trackingNumber, callback) => {
    let template = {
        ...uility.UPSRequestAuth,
        "TrackRequest": {
            "Request": {
                "RequestOption": "1",
                "TransactionReference": {
                    "CustomerContext": trackingNumber
                }
            },
            "InquiryNumber": trackingNumber
        }
    }

    let response_template = {
        trackingNo: trackingNumber,
        status: "no information",
    }
    request({
        method: 'POST',
        headers: { "content-type": "application/json" },
        url: 'https://onlinetools.ups.com/rest/Track',
        body: JSON.stringify(template)
    }, function (error, response, body) {
        let myReponse = JSON.parse(response.body)
        //   callback(null, myReponse)

        if (error) {
            response_template.message = error
            callback(null, response_template)
        } else if (myReponse.Fault) {
            callback(null, response_template)
        } else if (myReponse.TrackResponse.Response.ResponseStatus.Code == "1") {
            let info = myReponse.TrackResponse.Shipment.Package
            if (Array.isArray(info.Activity)) {
                info.Activity[0].Status.Description == 'Delivered' ? response_template.status = 'delivered' :
                    response_template.status = 'in transit'
                callback(null, response_template)
            } else {
                response_template.status = 'created'
                callback(null, response_template)
                //   info.Activity.Status.Description == 'Order Processed: Ready for UPS'?
            }
        }
    });
}

const GetRate = (request_body) => {
    // console.log(request_body)
    let template = {
        "RateRequest": {
            "Request": {
                "SubVersion": "1703",
                "TransactionReference": {
                    "CustomerContext": "myorder"
                }
            },
            "Shipment": {
                "ShipmentServiceOptions": {
                },
                "ShipmentRatingOptions": {
                    // "NegotiatedRatesIndicator": "TRUE",
                    // "UserLevelDiscountIndicator": "TRUE",
                    "RateChartIndicator": 'TRUE'
                },
                "Shipper": {
                    "Name": "Billy Blanks",
                    "ShipperNumber": "1931WE",
                    "Address": {
                        "AddressLine": request_body.from.addressline,
                        "City": request_body.from.city,
                        "StateProvinceCode": request_body.from.state,
                        "PostalCode": request_body.from.zipcode,
                        "CountryCode": "US"
                    }
                },
                "ShipTo": {
                    "Name": "Sarita Lynn",
                    "Address": {
                        // "ResidentialAddressIndicator":'TRUE',
                        "AddressLine": request_body.to.addressline,
                        "City": request_body.to.city,
                        "StateProvinceCode": request_body.to.state,
                        "PostalCode": request_body.to.zipcode,
                        "CountryCode": "US"
                    }
                },
                "ShipFrom": {
                    "Name": "Billy Blanks",
                    "Address": {
                        "AddressLine": request_body.from.addressline,
                        "City": request_body.from.city,
                        "StateProvinceCode": request_body.from.state,
                        "PostalCode": request_body.from.zipcode,
                        "CountryCode": "US"
                    }
                },
                "Service": {
                    "Code": "03",
                    "Description": "Ground"
                },
                "ShipmentTotalWeight": {
                    "UnitOfMeasurement": {
                        "Code": "LBS",
                        "Description": "Pounds"
                    },
                    "Weight": "3",
                },
                "Package": {
                    "PackagingType": {
                        "Code": "02",
                        "Description": "Package"
                    },
                    "Dimensions": {
                        "UnitOfMeasurement": {
                            "Code": "IN"
                        },
                        "Length": "5",
                        "Width": "5",
                        "Height": "5"
                    },
                    "PackageWeight": {
                        "UnitOfMeasurement": {
                            "Code": "LBS"
                        },
                        "Weight": "1"
                    }
                },
            }


        }
    }
    let options = {
        method: 'POST',
        headers: {
            "content-type": "application/json",
            "AccessLicenseNumber": '3D49FA354B0943B8',
            "Password": '14113Cerritos',
            "Username": 'Ebuysinotrans',
            "transId": "Tran123",
            "transactionSrc": "123",
        },
        url: 'https://onlinetools.ups.com/ship/v1/rating/Rate',
        body: JSON.stringify(template)
    };

    return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            // console.log(response.body)
            if (error) {
                reject(response.body)
            }
            resolve(JSON.parse(response.body))
        })
    })
}

const GetAddressTypeaAlter = (request_body, callback) => {
    let zipcode = {
        from: request_body.from.zipcode,
        to: request_body.to.zipcode,
    }

    let myReponse = {
        order_id: request_body.to.orderid,
        status:'error',
        is_residence: undefined,
        is_delivery_area_extend: undefined,
        zone: undefined
    }
    usps.getUspsZonePromise(zipcode).then(result => {
        myReponse.zone = result.zone
        GetRate(request_body).then(result => {
            // console.log(result["RateResponse"]["Response"].ResponseStatus.Code == '1')
            if (result["RateResponse"]["Response"].ResponseStatus.Code === '1') {
                let surcharge_code = []
                // surcharge_code.concat(surcharge_code_one).concat(surcharge_code_two)
                let surcharge_code_one = result.RateResponse.RatedShipment.ItemizedCharges
                let surcharge_code_two = result.RateResponse.RatedShipment.RatedPackage.ItemizedCharges
                surcharge_code = _.without(surcharge_code.concat(surcharge_code_one).concat(surcharge_code_two), undefined);
                console.log(surcharge_code)
                myReponse.is_residence = surcharge_code.map(item => item.Code).includes('270')
                myReponse.is_delivery_area_extend = surcharge_code.map(item => item.Code).includes('376')
                myReponse.status = 'success'
                callback(null, myReponse)
            } else {
                callback(null, myReponse)
            }
            // console.log(myReponse)  
        }).catch(error => {
            console.log(error)
            callback(null, myReponse)
        })
    }).catch(error => {
        console.log(error)
        callback(null, myReponse)
    })
    // console.log(request_body)
}

const GetAddressType = (request_body) => {
    // console.log(request_body)
    let myReponse = {
        is_residence: undefined,
        is_delivery_area_extend: undefined,
    }

    return new Promise((resolve, reject) => {
        GetRate(request_body).then(result => {
            // console.log(result["RateResponse"]["Response"].ResponseStatus.Code == '1')
            if (result["RateResponse"]["Response"].ResponseStatus.Code === '1') {
                let surcharge_code = []
                // surcharge_code.concat(surcharge_code_one).concat(surcharge_code_two)
                let surcharge_code_one = result.RateResponse.RatedShipment.ItemizedCharges
                let surcharge_code_two = result.RateResponse.RatedShipment.RatedPackage.ItemizedCharges
                surcharge_code = _.without(surcharge_code.concat(surcharge_code_one).concat(surcharge_code_two), undefined);
                console.log(surcharge_code)
                myReponse.is_residence = surcharge_code.map(item => item.Code).includes('270')
                myReponse.is_delivery_area_extend = surcharge_code.map(item => item.Code).includes('376')
                resolve(myReponse)
            } else {
                resolve(myReponse)
            }
            // console.log(myReponse)

        }).catch(error => {
            console.log(error)
            reject(error)
        }
        )
    })
}

module.exports = {
    verifyAddressUPS,
    TrackingUPS,
    GetUpsInTransitTime,
    GetUpsTrackingStatus,
    GetRate,
    GetAddressType,
    GetAddressTypeaAlter
}