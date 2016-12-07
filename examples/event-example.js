var express = require('express');
var expresstracer = require('express-tracer');
var DTE = require('../');
var dte = new DTE();

var app = express();
expresstracer(app);

// Add a middleware that runs trace function.
app.use(dte.start);

// Add a route to show request traces.
app.get('/', function(req, res, next){
  res.trace('some.event', 'some event data');
  res.send('Hello world!');
  next();
});

// Add an after request processing middleware that runs trace.
app.use(dte.finish);


// Configure tracer.
app.instrument(dte.instrument);

app.listen(3000);
console.log('Express started on port 3000');
