var express = require('express');
var path = require('path');



var routes = require('./routes.js');

var app = express();

app.configure(function() {
    app.use(express.static(path.join(__dirname, '../public')));
    app.use(routes.index);
});


var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000;

var ip = process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";

app.listen(port, ip, function() {
    console.log(' - listening on ' + port);
});
