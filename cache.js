var fs = require('fs');
var path = require('path');

var cache_path = '.cache/';

var cache = module.exports;

cache.is_cached = function(file_path) {
	if(!fs.existsSync(cache_path))
		fs.mkdirSync(cache_path, 0755);
	var file_path_dir = path.dirname(file_path).replace(/\//g, '.').substr(1).concat('.');
	console.log(file_path_dir);
	var cached_file_path = path.normalize(cache_path + file_path_dir + path.basename(file_path).replace('.js', '.ugly.js'));
	if(fs.existsSync(cached_file_path))
		return true;
	return false;
}

cache.cache_file = function(file_path, data) {
	var file_path_dir = path.dirname(file_path).replace(/\//g, '.').substr(1).concat('.');
	var tocache_path = path.normalize(cache_path + file_path_dir + path.basename(file_path).replace('.js', '.ugly.js'));
 	fs.writeFile(path.normalize(tocache_path), data, "utf-8",
	function(err) {
		if(err) console.log(err);
	});
};
	

cache.fetch_file = function(file_path) {
	var file_path_dir = path.dirname(file_path).replace(/\//g, '.').substr(1).concat('.');
	var fetch_path = path.normalize(cache_path + file_path_dir + path.basename(file_path).replace('.js', '.ugly.js'));
	var cached_file = fs.readFileSync(fetch_path, 'utf8');
	return cached_file;
}

