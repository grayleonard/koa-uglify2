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

