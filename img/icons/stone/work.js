var fs = require('fs');

fs.readdir(__dirname, function (err, files) {
	
	files.forEach(function (fileName) {
		if (fileName.indexOf('.js') === -1) {
			if (fileName.charAt(0) == '_') {
				fs.rename(fileName, fileName.substr(1).toLowerCase())	
			} else {
				fs.rename(fileName, '_' + fileName);
			}	
		}
	});
});