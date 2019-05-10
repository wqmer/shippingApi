const express = require('express');
const bodyParser = require('body-parser');
const myapi = require('./public/app')
const PDFDocument = require('pdfkit');
const parseString = require('xml2js').parseString;
var   async = require('async');

require('body-parser-xml')(bodyParser);

var app = express();
var port = process.env.PORT || 5000 ;

app.use(bodyParser.xml({
    limit: '1MB',   // Reject payload bigger than 1 MB
    xmlParseOptions: {
      normalize: true,     // Trim whitespace inside text nodes
      normalizeTags: true, // Transform tags to lowercase
      explicitArray: false // Only put nodes in array if >1
    }
  }));

app.use(bodyParser.json());

app.use('/', require('./router/Chukoula'));

// app.use('/LosAPIService', require('./router/LosAPIService'));

app.get('/', (req, res) => {
    let hello = `Hello, Api Server is running on ${port}`
    res.send(hello),(e) => res.sendStatus(400) ; 
})


app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});
  

  
  
  
