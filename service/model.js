const config = require('./config')



class Result {
    constructor() {
            this.hold = 0 ;
            this.in_transit = 0 ;
            this.out_of_delivery = 0;
            this.justCreated_or_noRecord = 0;
            this.delivery = 0 ;
            
    }
    update(code) { 
            switch (code) {
                case '0':
                  this.in_transit ++ ;
                  break;
                case '3':
                  this.delivery ++;
                  break;
                case '2':
                  this.hold ++;
                  break;
                case '5':
                  this.out_of_delivery ++;
                  break;
                default:
                  this.justCreated_or_noRecord ++;
                  break;     
            }
     }
}

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



// class UpsRequest {

//       constructor() {
//                    this.request_content = undefined ;
//        }

//        getRequest(code) {
//           switch (code) {
//                 case 'tracking':
//                      this.request_content = 
//                                           { 
//                                               UPSRequestAuth ,
//                                               "TrackRequest": { 
//                                               "Request": {
//                                               "RequestOption": "1", "TransactionReference": {
//                                               "CustomerContext": "Your Test Case Summary Description" }
//                                               },
//                                               "InquiryNumber": "1Z7AT5270219361709" 
//                                               }     
//                                           };
//                   break;
//                 case 'verifyAddress':
//                        this.request_content = 
//                                             { 
//                                                 UPSRequestAuth ,
//                                                 "TrackRequest": { 
//                                                 "Request": {
//                                                 "RequestOption": "1", "TransactionReference": {
//                                                 "CustomerContext": "Your Test Case Summary Description" }
//                                                 },
//                                                 "InquiryNumber": "1Z7AT5270219361709" 
//                                                 }     
//                                             };
//                   break;
//                 default:
//                           this.request_content = undefined ;
//                   break;     
//         } 
//     }
// }

 


module.exports = { Result, UPSRequestAuth}