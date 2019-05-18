var express = require('express');
var expresstracer = require('express-tracer');
var DTE = require('../../dtrace-express');
var dte = new DTE({ 'latency': true });
var app = express();
expresstracer(app);

// Add a middleware that runs trace function.
app.use(dte.start);

// Add a route to show request traces.
app.get('/', function (req, res, next) {
  res.send('Hello world!');
  next();
});

// Add an after request processing middleware that runs trace.
app.use(dte.finish);

// Configure tracer.
app.instrument(dte.instrument);

app.listen(3000);
console.log('Express started on port 3000');
