const config = require('../config')
const convert = require('convert-units')
const moment = require('moment')

const endicia_auth = {
      "RequesterID": config.usps_endicia.RequesterID,
      "AccountID":  config.usps_endicia.accountNumber,
      "PassPhrase": config.usps_endicia.passPhrase,
}


const handleBuyPostageRequest = (request) => { 
     let record = {
         "RecreditRequest" : {     
              "RequesterID": config.usps_endicia.RequesterID,
              "RequestID": '1',
              "CertifiedIntermediary": {
                   "AccountID":  config.usps_endicia.accountNumber,
                   "PassPhrase": config.usps_endicia.passPhrase,
               },
         "RecreditAmount" : request.amount 
        }
     }
return record
}


const handleShipRequest = (request) => { 
      let order = {
          "MailClass" : request.shipMethod,
          "WeightOz": request.Weight,
          "PartnerCustomerID": '123',
          "PartnerTransactionID": request.OrderID,
          "ToName":request.Sname,
          "ToAddress1":request.Sadd1,
          "ToCity":request.Scity,
          "ToState":request.Sstate,
          "ToPostalCode":request.Spostcode,
          "FromCompany":request.Fcompany,
          "FromName":request.FromName,
          "ReturnAddress1":request.Fadd1,
          "FromCity":request.Fcity,
          "FromState":request.Fstate,
          "FromPostalCode":request.Fpostcode
      }
return order
}


{/* <LabelRequest>
  <MailClass>Priority</MailClass>
  <WeightOz>16</WeightOz>
  <RequesterID>[RequesterID]</RequesterID>
  <AccountID>9999999</AccountID>
  <PassPhrase>ABCDEFGHIJK</PassPhrase>
  <PartnerCustomerID>100</PartnerCustomerID>
  <PartnerTransactionID>200</PartnerTransactionID>
  <ToName>Jane Doe</ToName>
  <ToAddress1>278 Castro Street</ToAddress1>
  <ToCity>Mountain View</ToCity>
  <ToState>CA</ToState>
  <ToPostalCode>94041</ToPostalCode>
  <FromCompany>Endicia, Inc.</FromCompany>
  <FromName>John Doe</FromName>
  <ReturnAddress1>1990 Grand Ave</ReturnAddress1>
  <FromCity>El Segundo</FromCity>
  <FromState>CA</FromState>
  <FromPostalCode>90245</FromPostalCode>
</LabelRequest> */}


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
module.exports = { 
    endicia_auth,
    handleShipRequest,
    handleBuyPostageRequest,
}