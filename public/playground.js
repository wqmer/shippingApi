


const async = require('../public/async')
const api = require('../uility/api')



// var in_transit = 'EV848317219CN'
var in_transit = 'EV846537897CN'
var fake =  'EV848317CN'
var array = ['EV848317219CN','EV851050039CN','EV849883201CN','1366980414','122131231','1000177743','EV858056305CN'] 
var string = 'EV848317219CN,EV851050039CN,EV851050039CN,EV851050039CN,EV851050039CN,EV851050039CN,EV851050039CN,EV851050039CN,EV851050039CN,EV851050039CN,EV851050039CN,EV851050039CN,EV851050039CN,EV851050039CN,EV851050039CN,EV851050039CN,EV851050039CN,EV851050039CN,EV851050039CN,EV851050039CN,EV851050039CN,EV851050039CN,EV851050039CN,EV851050039CN,EV851050039CN,EV851050039CN,EV851050039CN,EV851050039CN,EV851050039CN,EV851050039CN,2,3,4,5,6,7,8,9,10,11,12,13,12212132323132321,12313232123123,123321213231,21332231312213,31223321213321213,123123123123,1233122133213,232323,3232233,1000177743,EV858056305CN'
let obj = {
    name : 'kimi' ,
    number : '10'
}

api.getUspsTracking(in_transit).then(result => console.log(result))

