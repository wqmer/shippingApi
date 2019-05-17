const config = require('../config')

const UPSRequestAuth = {
    "UPSSecurity": { 
                     "UsernameToken": {
                                        "Username": config.ups.Username ,
                                        "Password": config.ups.Password
                      },
                     "ServiceAccessToken": {
                                         "AccessLicenseNumber": config.ups.AccessLicenseNumber
                      }   
      },
}


module.exports = {UPSRequestAuth}