const dotenv = require('dotenv')
dotenv.config({ silent: process.env.NODE_ENV === 'prod' })

const usps = {
    user_id : "849XUEHU5746"
}

const ups = {
             Username: process.env.UPS_USERNAME,
             Password: process.env.UPS_PASSWORD,
             AccessLicenseNumber: process.env.UPS_ACCESSLICENSE_NUMBER
}

const fedex_prod  = {
      password : process.env.FEDEX_PASSWORD,
      key :  process.env.FEDEX_KEY,
      Account_Number : process.env.FEDEX_ACCOUNT_NUMBER,
      Meter_Number : process.env.FEDEX_METER_NUMBER 
}

const usps_endicia_product = {
    wsdl_url : "https://elstestserver.endicia.com/LabelService/EwsLabelService.asmx?wsdl",
    passPhrase :  "`@198811532Ww",
    RequesterID :  "lxxx",
    accountNumber : "2552889" 
}


const fedex_test  = {
      password : "nDL641ljD029QgVj459viquRc",
      key : "SjgF06iYpTJ9hyFz",
      Account_Number : "510087640",
      Meter_Number : "119152006" ,
}


const usps_endicia_test = {
      wsdl_url : "https://elstestserver.endicia.com/LabelService/EwsLabelService.asmx?wsdl",
      passPhrase :  "`@198811532Ww",
      RequesterID :  "lxxx",
      accountNumber : "2552889" 
}

const kuaidi365 = {
    apiKey : "29833628d495d7a5"
}
const Aftership = {
    apiKey : "23a9737b-d9d7-45c1-851e-f85cb58bbcbc"
}

module.exports =  {
      ups,
      fedex : process.env.NODE_ENV == 'test'? fedex_test : fedex_prod ,
      usps_endicia : process.env.NODE_ENV == 'test'? usps_endicia_test  : usps_endicia_product  ,
      usps ,
      kuaidi365,
      Aftership
}

