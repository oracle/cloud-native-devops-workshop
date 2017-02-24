var http = require('http');
var fs = require('fs');
var path = require('path');
var PORT = process.env.PORT || 80;
var os = require("os");
var hostname = os.hostname();

http.createServer(function (request, response) {

	if (request.url && request.url.startsWith('/env/')) {
		var osVariable = request.url.substring(request.url.lastIndexOf('/') + 1);
			console.log('getting variable...' + osVariable);

		var varValue = process.env[osVariable]
		console.log('variable value: ' + varValue);

		response.writeHead(200, { 'Content-Type': contentType });
		response.end(varValue, 'utf-8');
    } else {

		var filePath = '.' + request.url;
		if (filePath == './')
			filePath = './index.html';

		var extname = path.extname(filePath);
		var contentType = 'text/html';
		switch (extname) {
			case '.js':
				contentType = 'text/javascript';
				break;
			case '.css':
				contentType = 'text/css';
				break;
			case '.json':
				contentType = 'application/json';
				break;
			case '.png':
				contentType = 'image/png';
				break;
			case '.jpg':
				contentType = 'image/jpg';
				break;
			case '.svg':
				contentType = 'image/svg+xml';
				break;
		}

		fs.readFile(filePath, function(error, content) {
			if (error) {
				if(error.code == 'ENOENT'){
					fs.readFile('./404.html', function(error, content) {
						response.writeHead(200, { 'Content-Type': contentType });
						response.end(content, 'utf-8');
					});
				}
				else {
					response.writeHead(500);
					response.end('Unknown error: '+error.code+' ..\n');
					response.end();
				}
			}
			else {
				response.writeHead(200, { 'Content-Type': contentType });
				response.end(content, 'utf-8');
			}
		});
	}

}).listen(PORT);
console.log('Server running at http://' + hostname + ':' + PORT);