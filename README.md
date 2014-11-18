koa-uglify2
===========

Koa middleware to uglify javascript.
Inspired by [express-uglify](https://github.com/ncrohn/express-uglify)

It automatically uglifies every javascript file served. A basic cache functions to cut down on load time.

Install
=======

```
npm install koa-uglify2
```

Basic Usage
===========

```javascript
var koa = require('koa');
var app = koa();
var uglify = require('koa-uglify2');

app.use(uglify({
	src: 'public/'
	})
);

app.listen(8080);
```

Advanced Usage
==============

You can also create regex rules to uglify files that are not served statically.

```javascript
app.use(uglify({
	src: 'public/',
	rules:	{
		'google/jquery.js': /^\/.{3}\/regexExample\.js$/
		}
	})
);
```

This rule will serve public/google/jquery.js to any request that matches the regex, for example: ```GET 123/regexExample.js```.

As well, you can designate a directory-level rule to match all javascript files in the folder.

```javascript
app.use(uglify({
	rules:	{
		'admin-files/': /^\/.{5}\//
		}
	})
);
```

This rule will serve admin-files/*.js to, for example: ```GET 12345/testFile.js```

Note that regex needs to end with \\.js$/ - this middleware currently only handles request paths that end with '.js' to save CPU cycles; testing regexes for every request would be expensive.
