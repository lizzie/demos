var http = require("http"),
  fs = require("fs"),
  url = require('url');


http.createServer(function(request, response) {

var url_parts = url.parse(request.url, true);
var timeout = url_parts.query.timeout;

  setTimeout(function() {
    response.writeHead(200, {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*'
    });

    response.write('jQuery_push({data: "abort"})', 'utf8');
    response.end();
  }, timeout);
}).listen(8081);

