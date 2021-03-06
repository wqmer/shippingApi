const config = require('../config')
const convert = require('convert-units')
const moment = require('moment')

// 验证资料(根据接口不同可能不同)

// API TOKEN
// API KEY

// 发件信息

// Fname - 发件人
// Fcompany - 发件公司
// Ftel - 发件电话
// Fadd1 - 发件地址1
// Fadd2 - 发件地址2
// Fcity - 发件城市
// Fstate - 发件州
// Fpostcode - 发件邮编
// Fcountry - 发件国家


// 收件信息

// Sname - 收件人
// Scompany - 收件公司
// Stel - 收件电话
// Sadd1 - 收件地址1
// Sadd2 - 收件地址2
// Scity - 收件城市
// Sstate - 收件州
// Spostcode - 收件邮编
// Scountry - 收件国家

// 商品信息

// OrderID - 订单编号
// SKU - 商品编号
// Weight - 重量(oz)

// 备用信息

// Define1 - 自定义
// Define2 - 自定义
// Define3 - 自定义
// Define4 - 自定义
// Define5 - 自定义


// 返回数据

// TrackingNo - 跟踪号
// pdf - label面单
// Price - 价格信息
// Define1 - 自定义
// Define2 - 自定义
// Define3 - 自定义
// Define4 - 自定义
// Define5 - 自定义

const date = new Date();
const FEDEXRequestAuth = {
  "WebAuthenticationDetail": {
    //  "ParentCredential": {
    //     "Key": config.fedex.Prod_key,
    //     "Password": config.fedex.Prod_password                        
    //   },
    "UserCredential": {
      "Key": config.fedex.key,
      "Password": config.fedex.password
    }
  },
  "ClientDetail": {
    "AccountNumber": config.fedex.Account_Number,
    "MeterNumber": config.fedex.Meter_Number
  }
}

const FEDEXRequestTestAuth = {
  "WebAuthenticationDetail": {
    "UserCredential": {
      "Key": "SjgF06iYpTJ9hyFz",
      "Password": "nDL641ljD029QgVj459viquRc"
    }
  },
  "ClientDetail": {
    "AccountNumber": "510087640",
    "MeterNumber": "119152006",
  }
}



// "Version": {
//   "ServiceId":     "crs",
//   "Major":          24,
//   "Intermediate":   0,
//   "Minor":          0
// } ,
// "PreferredCurrency" : "USD",

const handleRateRequest = (request) => {
  let order = {
    "TransactionDetail": {
      "CustomerTransactionId": request.referenceNumber ? request.referenceNumber : ''
    },

    "Version": {
      "ServiceId": "crs",
      "Major": 24,
      "Intermediate": 0,
      "Minor": 0
    },

    "RequestedShipment": {
      //    "ShipTimestamp" : moment().add(1,'days').format( "YYYY-MM-DDTHH:MM:SS").toString(),
      "ShipTimestamp": new Date(date.getTime() + (24 * 60 * 60 * 1000)).toISOString(),
      //    "ShipTimestamp" : "2019-05-13T23:09:16",
      "DropoffType": "REGULAR_PICKUP",
      "ServiceType": request.shipMethod, //FEDEX_GROUND, SMART_POST
      "PackagingType": "YOUR_PACKAGING",
      "PreferredCurrency": "USD",
      "Shipper": {
        "Contact": {
          "PersonName": request.Fname ? request.Fname : '',
          "PhoneNumber": request.Ftel ? request.Ftel : ''
        },
        "Address": {
          "StreetLines": [
            request.Fadd1 ? request.Fadd1 : '',
            request.Fadd2 ? request.Fadd2 : '',
          ],
          "City": request.Fcity ? request.Fcity : '',
          "StateOrProvinceCode": request.Fstate ? request.Fstate : '',
          "PostalCode": request.Fpostcode ? request.Fpostcode : '',
          "CountryCode": request.Fcountry ? request.Fcountry : ''
        }
      },
      "Recipient": {
        "Contact": {
          "PersonName": request.Sname ? request.Sname : '',
          "PhoneNumber": request.Stel ? request.Stel : ''
        },
        "Address": {
          "StreetLines": [
            request.Sadd1 ? request.Sadd1 : '',
            request.Sadd2 ? request.Sadd2 : '',
          ],
          "City": request.Scity ? request.Scity : '',
          "StateOrProvinceCode": request.Sstate ? request.Sstate : '',
          "PostalCode": request.Spostcode ? request.Spostcode : '',
          "CountryCode": request.Scountry ? request.Scountry : '',
        }
      },
      "ShippingChargesPayment": {
        "PaymentType": "SENDER",
        "Payor": {
          "ResponsibleParty": {
            "AccountNumber": config.fedex.Account_Number
          }
        }
      },

      "SmartPostDetail": {
        "Indicia": "PARCEL_SELECT",
        "AncillaryEndorsement": "ADDRESS_CORRECTION",
        "HubId": "5531"
      },
      "LabelSpecification": {
        "LabelFormatType": "COMMON2D",
        "ImageType": "PDF",
        "LabelStockType": "STOCK_4X6"
      },
      "PackageCount": "1",
      "RequestedPackageLineItems": [{
        "SequenceNumber": 1,
        "GroupPackageCount": 1,
        "Weight": {
          "Units": "LB",
          "Value": convert(request.Weight).from('oz').to('lb')
        },
        "Dimensions": {
          "Length": 6,
          "Width": 4,
          "Height": 1,
          "Units": "IN"
        },
        "CustomerReferences": {
          "CustomerReferenceType": "CUSTOMER_REFERENCE",
          "Value": request.Define1
        }
      }]

    }
  }

  if (request.shipMethod == 'FEDEX_GROUND') delete order.RequestedShipment.SmartPostDetail
  return order
}

const handleRateTestRequest = (request) => {
  let order = {
    "TransactionDetail": {
      "CustomerTransactionId": request.referenceNumber ? request.referenceNumber : ''
    },

    "Version": {
      "ServiceId": "crs",
      "Major": 24,
      "Intermediate": 0,
      "Minor": 0
    },

    "RequestedShipment": {
      //    "ShipTimestamp" : moment().add(1,'days').format( "YYYY-MM-DDTHH:MM:SS").toString(),
      "ShipTimestamp": new Date(date.getTime() + (24 * 60 * 60 * 1000)).toISOString(),
      //    "ShipTimestamp" : "2019-05-13T23:09:16",
      "DropoffType": "REGULAR_PICKUP",
      "ServiceType": request.shipMethod, //FEDEX_GROUND, SMART_POST
      "PackagingType": "YOUR_PACKAGING",
      "PreferredCurrency": "USD",
      "Shipper": {
        "Contact": {
          "PersonName": request.Fname ? request.Fname : '',
          "PhoneNumber": request.Ftel ? request.Ftel : ''
        },
        "Address": {
          "StreetLines": [
            request.Fadd1 ? request.Fadd1 : '',
            request.Fadd2 ? request.Fadd2 : '',
          ],
          "City": request.Fcity ? request.Fcity : '',
          "StateOrProvinceCode": request.Fstate ? request.Fstate : '',
          "PostalCode": request.Fpostcode ? request.Fpostcode : '',
          "CountryCode": request.Fcountry ? request.Fcountry : ''
        }
      },
      "Recipient": {
        "Contact": {
          "PersonName": request.Sname ? request.Sname : '',
          "PhoneNumber": request.Stel ? request.Stel : ''
        },
        "Address": {
          "StreetLines": [
            request.Sadd1 ? request.Sadd1 : '',
            request.Sadd2 ? request.Sadd2 : '',
          ],
          "City": request.Scity ? request.Scity : '',
          "StateOrProvinceCode": request.Sstate ? request.Sstate : '',
          "PostalCode": request.Spostcode ? request.Spostcode : '',
          "CountryCode": request.Scountry ? request.Scountry : '',
        }
      },
      "ShippingChargesPayment": {
        "PaymentType": "SENDER",
        "Payor": {
          "ResponsibleParty": {
            "AccountNumber": '510087640'
          }
        }
      },

      "SmartPostDetail": {
        "Indicia": "PARCEL_SELECT",
        "AncillaryEndorsement": "ADDRESS_CORRECTION",
        "HubId": "5531"
      },
      "LabelSpecification": {
        "LabelFormatType": "COMMON2D",
        "ImageType": "PDF",
        "LabelStockType": "STOCK_4X6"
      },
      "PackageCount": "1",
      "RequestedPackageLineItems": [{
        "SequenceNumber": 1,
        "GroupPackageCount": 1,
        "Weight": {
          "Units": "LB",
          "Value": convert(request.Weight).from('oz').to('lb')
        },
        "Dimensions": {
          "Length": 6,
          "Width": 4,
          "Height": 1,
          "Units": "IN"
        },
        "CustomerReferences": {
          "CustomerReferenceType": "CUSTOMER_REFERENCE",
          "Value": request.Define1
        }
      }]

    }
  }

  if (request.shipMethod == 'FEDEX_GROUND') delete order.RequestedShipment.SmartPostDetail
  return order
}

const handleShipRequest = (request) => {
  let order = {
    "TransactionDetail": {
      "CustomerTransactionId": request.orderID
    },

    "Version": {
      "ServiceId": "ship",
      "Major": 23,
      "Intermediate": 0,
      "Minor": 0
    },

    "RequestedShipment": {
      //    "ShipTimestamp" : moment().add(1,'days').format( "YYYY-MM-DDTHH:MM:SS").toString(),
      "ShipTimestamp": new Date(date.getTime() + (24 * 60 * 60 * 1000)).toISOString(),
      // "ShipTimestamp" : "2019-11-03T23:09:16",
      "DropoffType": "REGULAR_PICKUP",
      "ServiceType": request.shipMethod, //"FEDEX_GROUND", SMART_POST
      "PackagingType": "YOUR_PACKAGING",
      "Shipper": {
        "Contact": {
          "PersonName": request.Fname,
          "PhoneNumber": request.Ftel
        },
        "Address": {
          "StreetLines": [
            request.Fadd1,
            request.Fadd2
          ],
          "City": request.Fcity,
          "StateOrProvinceCode": request.Fstate,
          "PostalCode": request.Fpostcode,
          "CountryCode": request.Fcountry
        }
      },
      "Recipient": {
        "Contact": {
          "PersonName": request.Sname,
          "PhoneNumber": request.Stel
        },
        "Address": {
          "StreetLines": [
            request.Sadd1,
            request.Sadd2
          ],
          "City": request.Scity,
          "StateOrProvinceCode": request.Sstate,
          "PostalCode": request.Spostcode,
          "CountryCode": request.Scountry
        }
      },
      "ShippingChargesPayment": {
        "PaymentType": "SENDER",
        "Payor": {
          "ResponsibleParty": {
            "AccountNumber": config.fedex.Account_Number
          }
        }
      },

      "SmartPostDetail": {
        "Indicia": "PARCEL_SELECT",
        "AncillaryEndorsement": "ADDRESS_CORRECTION",
        "HubId": "5531"
      },
      "LabelSpecification": {
        "LabelFormatType": "COMMON2D",
        "ImageType": "PDF",
        "LabelStockType": "STOCK_4X6"
      },
      "PackageCount": "1",
      "RequestedPackageLineItems": [{
        "SequenceNumber": 1,
        "GroupPackageCount": 1,
        "Weight": {
          "Units": "LB",
          "Value": convert(request.Weight).from('oz').to('lb')
        },
        "Dimensions": {
          "Length": 6,
          "Width": 4,
          "Height": 1,
          "Units": "IN"
        },
        "CustomerReferences": {
          "CustomerReferenceType": "CUSTOMER_REFERENCE",
          "Value": request.Define1
        }
      }]
    }
  }

  if (request.shipMethod == 'FEDEX_GROUND') delete order.RequestedShipment.SmartPostDetail
  return order
}

const handleAddressValidate = (request) => {

  const args = {
    "WebAuthenticationDetail": {
      "UserCredential": {
        "Key": "SjgF06iYpTJ9hyFz",
        "Password": "nDL641ljD029QgVj459viquRc"
      }
    },

    "ClientDetail": {
      "AccountNumber": "510087640",
      "MeterNumber": "119152006",
      "Localization": {
        "LanguageCode": "EN",
        "LocaleCode": "US"
      }
    },

    "Version": {
      "ServiceId": "aval",
      "Major": 4,
      "Intermediate": 0,
      "Minor": 0
    },
    "AddressesToValidate": {
      "Address": {
        "StreetLines": request.address,
        "City": request.city,
        "StateOrProvinceCode": request.state,
        "PostalCode": request.zip,
        "UrbanizationCode": "",
        "CountryCode": "us"
      }
    }
  }
  return args
}

const handleTrackingshipment = (request) => {
  const args = {
    "TransactionDetail": {
      "CustomerTransactionId": request.orderId,
    },

    "Version": {
      "ServiceId": "trck",
      "Major": 18,
      "Intermediate": 0,
      "Minor": 0
    },
    "SelectionDetails": {
      //跟踪号如果大于12位，是smarpost服务，小于12位就是ground和express服务
      "CarrierCode": request.trackingNumber.length > 12 ? "FXSP" : "FDXE",
      "PackageIdentifier": {
        "Type": "TRACKING_NUMBER_OR_DOORTAG",
        "Value": request.trackingNumber,
      }
    },
    "ProcessingOptions": "INCLUDE_DETAILED_SCANS"

  }
  return args
}



module.exports = {
  FEDEXRequestTestAuth,
  FEDEXRequestAuth,
  handleShipRequest,
  handleRateRequest,
  handleTrackingshipment,
  handleAddressValidate,
  handleRateTestRequest
}