const express = require('express');
const bodyParser = require('body-parser');
const PDFDocument = require('pdfkit');
const parseString = require('xml2js').parseString;
var   async = require('async');
var timeout = require('connect-timeout')

require('body-parser-xml')(bodyParser);

var app = express();
var port = process.env.PORT || 5000 ;

// app.use(bodyParser.xml({
//     limit: '1MB',   // Reject payload bigger than 1 MB
//     xmlParseOptions: {
//       normalize: true,     // Trim whitespace inside text nodes
//       normalizeTags: true, // Transform tags to lowercase
//       explicitArray: false // Only put nodes in array if >1
//     }
//   }));

// function haltOnTimedout(req,res,next) {
//     if (req.timedout) {
//         res.send('timeout!')
//     } else {
//         next();
//     }
// };
// app.use(timeout('2s', ))
// app.use(haltOnTimedout);


app.use(bodyParser.json());

app.use(function(err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      res.status(400).send({ code: 400, message: "bad request" });
    } else next();
  });

app.use('/', require('./router/Chukoula'));
app.use('/', require('./router/ShippingTool.js'));
app.use('/', require('./router/Test.js'));

app.get('/', (req, res) => {
    let hello = `Hello, Api Server is running on ${port}`
    res.send(hello),(e) => res.sendStatus(400) ; 
})


app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});


  

  
  
  
