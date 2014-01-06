var path = require('path');
var fs = require('fs');

exports.index = function(req, res) {
    fs.readFile(path.join(__dirname, '../public/index.html'), 'utf8', function(err, text) {
	res.send(text);
    });
}
