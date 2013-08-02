var fs = require('fs');
var express = require('express');

var app = express.createServer(express.logger());

var outData;
fs.readFile('index.html', 'utf8', function (err, data) {
  if (err) throw err;
  console.log(data);
  outData=data;
});

app.get('/', function(request, response) {

    response.send(outData);
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});