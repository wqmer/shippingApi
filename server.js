const express = require('express');
const bodyParser = require('body-parser');
const myapi = require('./public/app')
const uility = require('./uility/api')
const parseString = require('xml2js').parseString;

var app = express();
var port = process.env.PORT || 5000 ;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    let hello = 'Hello, Server is running'
    res.send(hello),(e) => res.sendStatus(400) ; 
})

// app.get('/tracking/:id', (req, res) => {
//     let num = req.params.id
//     myapi.trackOne(num).then( result => res.send( JSON.stringify(result) ),(e) => res.sendStatus(400)); 
// })

app.get('/trackingAndShow/:id', (req, res) => {
    let num = req.params.id
    uility.detectCarrier(num).then(result => {
        if(result === 'sf-express') result = 'shunfeng'
        res.redirect(`https://www.kuaidi100.com/chaxun?com=${result}&nu=${num}`)
    })
    .catch(err => console.log(err))
})

app.post('/zoneLookUp', (req, res) => {
    let from = req.body.from ;
    let to = req.body.to ;
    uility.getUspsZone(from, to).then(result => { 
           parseString(result, (err, result) => { 
               let error = result.RateV4Response.Package[0].Error
               let zoneCode = result.RateV4Response.Package[0].Zone
               error?res.send( { success:false, description : error[0].Description[0]}):res.send( { success:true , zone : zoneCode[0]}) 
            })    
    }).catch(err => 
        res.send({sucess:false,description:'server is down'})
    )
})


// app.get('/trackings/:id', (req, res) => { 
//     let string = req.params.id
//     let arr = string.split(",");
//         array = arr.map( info => info.trim() )
//     myapi.trackList(array).then( result => res.send( JSON.stringify(result) ),(e) => res.sendStatus(400)); 
// })


app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});
  

  
  
  
