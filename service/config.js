const uspsId = '849XUEHU5746';

const ups = {
             Username: "Ebuysinotrans",
             Password: "14113Cerritos" ,
             AccessLicenseNumber: "3D49FA354B0943B8"
}



const fedex_test  = {
      password : "TSMYGLMI5ak8mh2kCi8aRkDLR",
      key : "F8GMIFLD4QEFhvjh",
      Account_Number : "510087100",
      Meter_Number : "119146125" ,
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

module.exports =  {
      uspsId ,
      ups,
      fedex : process.env.NODE_ENV == 'test'? fedex_test : fedex_prod ,
      usps_endicia : process.env.NODE_ENV == 'test'? usps_endicia_test  : usps_endicia_product  
}

