var uglify = require('uglify-js');
var url = require('url');
var path = require('path');
var fs = require('co-fs');
var cache = require('./cache.js');

module.exports = function(options) {

	var src = (options && options.hasOwnProperty('src')) ? options.src : './';
	var rules = (options && options.hasOwnProperty('rules')) ? options.rules : null;

	return function*(next) {
		if(/(\.js)$/.test(this.path) != true) {
			yield next;
			return;
		}
		var start = new Date;
		var file_path = this.path;
		var file_exists = false;
		if(rules == null) {
			file_exists = yield fs.exists(path.normalize(src + file_path));
		} else {
			var matched = false;
			for(var rule in rules) {
				var regex_rule = rules[rule];
				if(file_path.match(regex_rule)) {
					if(path.extname(rule) != '.js') {
						file_path = path.normalize(rule + '/' + path.basename(file_path));
					} else {
						file_path = rule;
					}
					file_exists = yield fs.exists(path.normalize(src + file_path));
					matched = true;
					break;
				}
			}
			if(!matched) {
				file_exists = yield fs.exists(path.normalize(src + file_path));
			}
		}
		if(!file_exists) {
			yield next;
			return;
		}
		if(cache.is_cached(file_path)) {
			var type = path.extname(file_path).substr(1);
			this.body = cache.fetch_file(file_path);
			this.type = type;
			var ms = new Date - start;
			console.log('%s %s - %s', this.method, this.url, ms);
		} else {
			var file = yield fs.readFile(path.normalize(src + file_path), 'utf8');
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
				cache.cache_file(file_path, ast.print_to_string());
				var ms = new Date - start;
				console.log('%s %s - %s', this.method, this.url, ms);
			}
		}
	}
}
