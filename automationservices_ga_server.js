#!/usr/bin/env nodejs
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World from automationservices.ga\n');
}).listen(4000, 'localhost');
console.log('Server running at http://localhost:4000/');
