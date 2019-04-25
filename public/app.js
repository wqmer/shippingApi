const Result = require('../service/model').Result
const async = require('../public/async')

var trackOne = (number) => {
    let displayResultByone = new Result();
    return  async.getTrackingByOne(number).then(code => displayResultByone.update(code)  )
                                          .then( () =>  (displayResultByone) )
                                          .catch(error => console.log(error))
                                          
}

var trackList = (array) => {
    let displayResult = new Result();
    return  async.getTrackingByList(array).then( result => result.forEach( code => displayResult.update(code) ) )
                                          .then( () =>  (displayResult) )
                                          .catch(error => console.log(error))
}
module.exports ={trackOne, trackList}