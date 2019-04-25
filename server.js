const express = require('express');
const bodyParser = require('body-parser');
const myapi = require('./public/app')
const PDFDocument = require('pdfkit');
const parseString = require('xml2js').parseString;
var   async = require('async');

var app = express();
var port = process.env.PORT || 5000 ;

app.use(bodyParser.json());

app.use('/', require('./router'));

app.get('/', (req, res) => {
    let hello = 'Hello, Server is running'
    res.send(hello),(e) => res.sendStatus(400) ; 
})


app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});
  

  
  
  
