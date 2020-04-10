const request = require('request');
const md5 = require('md5');
const config = require('../config')
const Timeout = require('await-timeout')
const timer = new Timeout();


const createOrder = (params, callback) => {
    let { appKey, requestDate, languageCode, instructionList } = params
    let realId
    instructionList[0].RealOrderID ? realId = instructionList[0].RealOrderID : realId = undefined
    delete instructionList[0].RealOrderID
    let request_body = { instructionList }
    let signature = md5(JSON.stringify(request_body) + config.usps_mofangyun.appSecret + requestDate);
    // console.log(params)
    const opts = {
        headers: {
            "content-type": "application/json",
            appKey,
            signature,
            requestDate,
            languageCode
        },
        url: 'http://47.75.131.124:8129/wgs/v1/internationalexpress/createExpressShipments',
        body: JSON.stringify(request_body)
    };
    request.post(opts, (error, response, body) => {
        if (error) {
            callback({ success: false, message: error.code });
        } else if (response.statusCode === 400) {
            callback('Unable to fetch data.');
        } else if (response.statusCode === 200) {
            callback(null, JSON.parse(body))
        }
    })
}

const getRate = (params) => {
    let { appKey, requestDate, languageCode, instructionList } = params
    let request_body = { instructionList }
    let signature = md5(JSON.stringify(request_body.instructionList) + config.usps_mofangyun.appSecret + requestDate);
    // console.log(JSON.stringify(request_body) )
    // console.log(params)
    const opts = {
        headers: {
            "content-type": "application/json",
            appKey,
            signature,
            requestDate,
            languageCode
        },
        url: 'http://47.75.131.124:8129/wgs/v1/openapi/rateProvider',
        body: JSON.stringify(request_body.instructionList)
    };

    return new Promise((resolve, reject) => {
        request.post(opts, (error, response, body) => {
            if (error) {
                console.log(error)
                reject({ success: false, message: error.code });
            } else if (response.statusCode === 200) {
                resolve(JSON.parse(response.body))   
            }       
        })
    })
}

const getLabel = (params, callback) => {
    let { appKey, requestDate, languageCode, instructionList } = params
    let request_body = { "instructionList": instructionList }
    let signature = md5(JSON.stringify(request_body) + config.usps_mofangyun.appSecret + requestDate);

    const opts = {
        headers: {
            "content-type": "application/json",
            appKey,
            signature,
            requestDate,
            languageCode
        },
        url: `${config.usps_mofangyun.apiEndport}/wgs/v1/internationalexpress/exprssShipmentTrackingNumbers`,
        body: JSON.stringify(request_body)
    };

    request.post(opts, (error, response, body) => {
        if (error) {
            callback({ success: false, message: error.code });
        } else if (response.statusCode === 400) {
            callback('Unable to fetch data.');
        } else if (response.statusCode === 200) {
            callback(null, JSON.parse(body))
        }
    })
}

const getChannel_async = (params) => {
    let { appKey, requestDate, languageCode } = params
    let signature = md5(config.usps_mofangyun.appSecret + requestDate);
    return new Promise((resolve, reject) => {
        const opts = {
            headers: {
                "content-type": "application/json",
                appKey,
                signature,
                requestDate,
                languageCode
            },
            url: `${config.usps_mofangyun.apiEndport}/wgs/v1/internationalexpress/getExpressChannel`,
        };

        request.get(opts, (error, response, body) => {
            if (error) {
                resolve({ success: false, message: error.code });
            } else if (response.statusCode === 400) {
                resolve('Unable to fetch data.');
            } else if (response.statusCode === 200) {
                resolve(JSON.parse(body))
            }
        })
    })
}

const createOrder_async = (params) => {
    let { appKey, requestDate, languageCode, instructionList } = params
    let realId
    instructionList[0].RealOrderID ? realId = instructionList[0].RealOrderID : realId = undefined
    delete instructionList[0].RealOrderID
    let request_body = { instructionList }
    let signature = md5(JSON.stringify(request_body) + config.usps_mofangyun.appSecret + requestDate);
    return new Promise((resolve, reject) => {
        const opts = {
            headers: {
                "content-type": "application/json",
                appKey,
                signature,
                requestDate,
                languageCode
            },
            url: `${config.usps_mofangyun.apiEndport}/wgs/v1/internationalexpress/createExpressShipments`,
            body: JSON.stringify(request_body)
        };
        request.post(opts, (error, response, body) => {
            // let mybody = {}
            if (error) {
                resolve({ success: false, message: error.code });
            } else if (response.statusCode === 400) {
                resolve(JSON.parse(response.body));
            } else if (response.statusCode === 200) {
                resolve(JSON.parse(body))
            }
        })
    })
}

const getLabel_async = (opts) => {
    return new Promise((resolve, reject) => {
        request.post(opts, (error, response, body) => {
            if (error) {
                reject({ success: false, message: error.code });
            } else if (response.statusCode === 400) {
                resolve(JSON.parse(response.body));
            } else if (response.statusCode === 200) {
                resolve(JSON.parse(body))
            }
        })
    })
}

const getOrder_async = (params, callback) => {
    let { appKey, requestDate, languageCode, instructionList } = params
    let realId

    instructionList[0].RealOrderID ? realId = instructionList[0].RealOrderID : realId = undefined
    createOrder_async(params).then(result => {
        //    console.log(result)
        if (result.instructionList) {
            if (result.instructionList[0].succeed) {
                // console.log(config.usps_mofangyun.appSecret) 
                let request_body = { "instructionList": [{ "userOrderNumber": result.instructionList[0].userOrderNumber }] }
                let signature = md5(JSON.stringify(request_body) + config.usps_mofangyun.appSecret + requestDate);
                const opts = {
                    headers: {
                        "content-type": "application/json",
                        appKey,
                        signature,
                        requestDate,
                        languageCode
                    },
                    
                    url: `${config.usps_mofangyun.apiEndport}/wgs/v1/internationalexpress/exprssShipmentTrackingNumbers`,
                    body: JSON.stringify(request_body)
                };

                // timer.set(3000).then(() =>  
                getLabel_async(opts).then(result => {
                    let {
                        succeed,
                        errorCode,
                        errorMessage,
                        userOrderNumber,
                        instructionNumber,
                        failReason,
                        mainTrackingNumber,
                        shipments
                    } = result.instructionList[0]

                    result.instructionList[0] = {
                        // succeed,
                        // errorCode,
                        // errorMessage,
                        userOrderNumber,
                        "RealOrderID": realId,
                        "Sku": "Sku",
                        "Sname": instructionList[0].recipient.contactName,
                        "Sadd1": instructionList[0].recipient.street,
                        "Sadd2": instructionList[0].recipient.street1,
                        "Scity": instructionList[0].recipient.city,
                        "Sstate": instructionList[0].recipient.state,
                        "Spostcode": instructionList[0].recipient.zipCode,
                        "Stel": instructionList[0].recipient.telephone,

                        "Fname": instructionList[0].sender.contactName,
                        "Ftel": instructionList[0].sender.telephone,
                        "Fadd1": instructionList[0].sender.street,
                        "Fadd2": instructionList[0].sender.street1,
                        "Fstate": instructionList[0].sender.state,
                        "Fcity": instructionList[0].sender.city,
                        "Fpostcode": instructionList[0].sender.zipCode,
                        "Weight": instructionList[0].packageDetailList[0].packageRecord.weight,
                        "Fcountry": "US",
                        "Method": instructionList[0].channelCode,
                        instructionNumber,
                        failReason,
                        mainTrackingNumber,
                        shipments
                    }
                    callback(null, result)
                }).catch(error => callback(null, { success: false, message: 'internal error' }))
                // );                  
            } else {
                callback(null, result.instructionList[0].errorMessage)
            }
        } else {
            callback(null, result)
        }
    }).catch(error => callback(null, error))
}


module.exports = {
    createOrder,
    getLabel,
    getOrder_async,
    getChannel_async,
    getRate,

    // AddOrderMainToConfirm  
}
