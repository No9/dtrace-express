var express = require('express');
var etrace = require('express-tracer');

var dte = require('../');
var app = express();
etrace(app);

// Helpers to generate random ids.
function random(){
  return Math.random().toString(36).slice(2);
}
// Add a middleware that runs trace function.
app.use(dte.start);

// Add another middleware that runs trace after an asynchronous call.
app.use(function(req, res, next){
  res.trace('wait:before');
  setTimeout(function () {
    res.trace('wait:after');
    next();
  }, Math.random() * 100);
});

// Add a route to show request traces.
app.get('/', function(req, res, next){
  res.trace('user.id', random());
  res.trace('some.event', random(), random());
  res.trace('another.event', random(), random());
  res.set('X-Response-Time', (Date.now() - res.start) + 'ms');
  res.send('Hello world!');
  next();
});

// Add an after request processing middleware that runs trace.
app.use(dte.finish);


// Configure tracer.
app.instrument(dte.instrument);

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
