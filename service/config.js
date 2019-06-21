const usps = {
    user_id : "849XUEHU5746"
}

const ups = {
             Username: "Ebuysinotrans",
             Password: "14113Cerritos" ,
             AccessLicenseNumber: "3D49FA354B0943B8"
}

const fedex_test  = {
      password : "nDL641ljD029QgVj459viquRc",
      key : "SjgF06iYpTJ9hyFz",
      Account_Number : "510087640",
      Meter_Number : "119152006" ,
}

const fedex_prod  = {
      password : "2lR19PZo0srnvTj6NwDkrxZvb",
      key :  "X14g5s5AKzSgaHKJ",
      Account_Number : "630270839",
      Meter_Number : "114648773" 
}


const usps_endicia_test = {
      wsdl_url : "https://elstestserver.endicia.com/LabelService/EwsLabelService.asmx?wsdl",
      passPhrase :  "`@198811532Ww",
      RequesterID :  "lxxx",
      accountNumber : "2552889" 
}

const usps_endicia_product = {
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

