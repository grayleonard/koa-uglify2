var uglify = require('uglify-js');
var url = require('url');
var path = require('path');
var fs = require('co-fs');
var cache = require('./cache.js');

module.exports = function(options) {

	var src = (options && options.hasOwnProperty('src')) ? options.src : '.';

	return function*(next) {
		var start = new Date;
	
		if(/(\.js)$/.test(this.path) != true) {
			yield next;
			var ms = new Date - start;
			console.log('%s %s - %s', this.method, this.url, ms);
		} else {
			var file_path = url.parse(this.url).pathname;
			if(cache.is_cached(file_path)) {
				console.log('fetching cached');
				var type = path.extname(file_path).substr(1);
				this.body = cache.fetch_file(file_path);
				this.type = type;
				var ms = new Date - start;
				console.log('%s %s - %s', this.method, this.url, ms);
			} else {
				var file = yield fs.readFile(src + file_path, 'utf8');
				var type = path.extname(file_path).substr(1);
				var ast;
				try {
					ast = uglify.parse(file);
					ast.figure_out_scope();
					var compressor = uglify.Compressor();
					ast = ast.transform(compressor);
					ast.figure_out_scope();
					ast.compute_char_frequency();
					ast.mangle_names();
				} catch (x) {
					console.log(x);
				}
				if(ast) {
					this.body = ast.print_to_string();
					this.type = type;
					cache.cache_file(src + file_path);
					var ms = new Date - start;
					console.log('%s %s - %s', this.method, this.url, ms);
				}
			}
		}
	}
}
