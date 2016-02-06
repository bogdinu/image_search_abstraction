//var Bing = require('node-bing-api')({ accKey: "your-account-key" });
//var Bing = require('node-bing-api')({ accKey: "9f9zADgENk0T2TTebIo/c1Crj1X+14TtFfaXvntmw00" });
/*Bing.images("Ninja Turtles", {skip: 50}, function(error, res, body){
  console.log(body);
});*/


'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');

var app = express();

routes(app);

app.listen(8080, function () {
    console.log('Listening on port 8080...');
});
