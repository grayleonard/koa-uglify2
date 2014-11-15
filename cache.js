var fs = require('fs');
var path = require('path');

var cachePath = '.cache/';
var extension = '.ugly';

var cache = module.exports;

cache.is_cached = function(file_path) {

	if(!fs.existsSync(cachePath))
		fs.mkdirSync(cachePath, 0755);

	try {
		var cached_file_path = path.normalize(cachePath + path.basename(file_path).replace('.js', '.ugly.js'));

		console.log(cached_file_path);
		var cached_file = fs.readFileSync(cached_file_path, 'utf8');
		return true;
	} catch(e) {
		return false;
	}
}

cache.cache_file = function(file_path) {
	var cacheDir = path.normalize(cachePath),
	cacheFile = cacheDir+path.basename(file_path).replace(".js", ".ugly.js");

	fs.writeFile(path.normalize(cacheFile), fs.readFileSync(file_path), "utf-8",
	function(err) {
		if(err) console.log(err);
	});
};
	

cache.fetch_file = function(file_path) {
	var cacheDir = path.normalize(cachePath),
	cacheFile = cacheDir+path.basename(file_path).replace(".js", ".ugly.js");	
	var cached_file = fs.readFileSync(cacheFile, 'utf8');
	return cached_file;
}

