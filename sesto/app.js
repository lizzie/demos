var logger = require('koa-logger');
var route = require('koa-route');
var serve = require('koa-static');
var render = require('./render');
var koa = require('koa');

var app = koa();

app.use(logger());

app.use(serve('assets'));

app.use(route.get("/signup", signup));
app.use(route.get("/login", login));

function *signup() {
  this.body = yield render('signup', { });
}

function *login() {
  this.body = yield render('login', { });

}
app.listen(3000);
console.log('listening on port 3000');



