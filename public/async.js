const api = require('../service/api')


 getTrackingByOne = (number, retry = 3) =>{
      let count = 0
      let code
      return  new Promise ( ( resolve ,reject ) => {
              api.detectCarrier(number)
                 .then(result =>  {
                     switch (result) {
                        case 'undefined': 
                          resolve(undefined) 
                          break;
                        case 'usps':
                                    api.getUspsTracking(number).then(result => resolve(result))  
                                    .catch( err => { 
                                            // if (err == 'undefined state' && retry > 0) { resolve( getTrackingByOne( number,  retry - 1 ) )} 
                                            reject(err) 
                                    })
                          break;
                        default:
                                    api.getDhlTracking(number).then(result => resolve(result))  
                                    .catch( err => { 
                                            // if (err == 'undefined state' && retry > 0) { resolve( getTrackingByOne( number,  retry - 1 ) )} 
                                            reject(err) 
                                    })
                          break;         
                      }    
                })
            })
}


const getTrackingByList = (list) => {
    var pArray = [];
        list.forEach( number  => { 
            pArray.push( getTrackingByOne( number ) )  
       });
        return Promise.all(pArray)
}




module.exports = { getTrackingByOne, getTrackingByList}