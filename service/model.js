const config = require('./config')

class UPS {
    constructor(Username , Password , AccessLicenseNumber) {
            this.Username = Username ;
            this.Password = Password ;
            this.AccessLicenseNumber = AccessLicenseNumber ;
            
    }

    auth(){
           return {   
                   "UPSSecurity": { 
                          "UsernameToken": {
                                            "Username": this.Username  ,
                                            "Password": this.Password
                                           },
                          "ServiceAccessToken": {
                                             "AccessLicenseNumber": this.AccessLicenseNumber 
                           }   
                        },
                  }
    }

    ship(){
    //   console.log(auth())
      // console.log('it works from ship ' + this.name + ' ' + args)
    }

    varifyAddress(){
    //   console.log('it works from varify')
    }

    tracking(){
    //   console.log('it works from tracking')
    }
}

// class Carrier {
//     constructor(name) {
//             this.name = name ;
//     }

//     auth(){
//          let authObj = '123'
//          return authObj
//     }

//     ship(){
//       console.log(auth())
//       // console.log('it works from ship ' + this.name + ' ' + args)
//     }

//     varifyAddress(){
//       console.log('it works from varify')
//     }

//     tracking(){
//       console.log('it works from tracking')
//    }
// }

// class Carrier {
//     constructor(name) {
//             this.name = name ;
//     }

//     auth(){
//          let authObj = '123'
//          return authObj
//     }

//     ship(){
//       console.log(auth())
//       // console.log('it works from ship ' + this.name + ' ' + args)
//     }

//     varifyAddress(){
//       console.log('it works from varify')
//     }

//     tracking(){
//       console.log('it works from tracking')
//    }
// }

// class Carrier {
//     constructor(name) {
//             this.name = name ;
//     }

//     auth(){
//          let authObj = '123'
//          return authObj
//     }

//     ship(){
//       console.log(auth())
//       // console.log('it works from ship ' + this.name + ' ' + args)
//     }

//     varifyAddress(){
//       console.log('it works from varify')
//     }

//     tracking(){
//       console.log('it works from tracking')
//    }
// }

// class Carrier {
//     constructor(name) {
//             this.name = name ;
//     }

//     auth(){
//          let authObj = '123'
//          return authObj
//     }

//     ship(){
//       console.log(auth())
//       // console.log('it works from ship ' + this.name + ' ' + args)
//     }

//     varifyAddress(){
//       console.log('it works from varify')
//     }

//     tracking(){
//       console.log('it works from tracking')
//    }
// }

// class Carrier {
//     constructor(name) {
//             this.name = name ;
//     }

//     auth(){
//          let authObj = '123'
//          return authObj
//     }

//     ship(){
//       console.log(auth())
//       // console.log('it works from ship ' + this.name + ' ' + args)
//     }

//     varifyAddress(){
//       console.log('it works from varify')
//     }

//     tracking(){
//       console.log('it works from tracking')
//    }
// }

// class Carrier {
//     constructor(name) {
//             this.name = name ;
//     }

//     auth(){
//          let authObj = '123'
//          return authObj
//     }

//     ship(){
//       console.log(auth())
//       // console.log('it works from ship ' + this.name + ' ' + args)
//     }

//     varifyAddress(){
//       console.log('it works from varify')
//     }

//     tracking(){
//       console.log('it works from tracking')
//    }
// }





const handelresposne = {



}                                        


module.exports = {handelresposne,  }