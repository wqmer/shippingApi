var http = require('http');
var querystring = require('querystring');

var server = http.createServer().listen(3000);

server.on('request', function (req, res) {
    if (req.method == 'POST') {
        var body = '';
    }

    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
       // var post = body ;
        var post = querystring.parse(body);
        var test = 'hello' 
        console.log(post);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        // post === {} ? res.end('hello') : res.end(post) ;
        res.end(test)
    });
});

console.log('Listening on port 3000');
