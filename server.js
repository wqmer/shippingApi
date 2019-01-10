const express = require('express');
const bodyParser = require('body-parser');
const myapi = require('./public/app')
const uility = require('./uility/api')

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


// app.get('/trackings/:id', (req, res) => { 
//     let string = req.params.id
//     let arr = string.split(",");
//         array = arr.map( info => info.trim() )
//     myapi.trackList(array).then( result => res.send( JSON.stringify(result) ),(e) => res.sendStatus(400)); 
// })


app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});
  

  
  
  
