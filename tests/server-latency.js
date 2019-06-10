var process = require('process');
var express = require('express');
var expresstracer = require('express-tracer');
var DTE = require('../dtrace-express');
var dte = new DTE();

var app = express();
expresstracer(app);
app.instrument(dte.instrument);

// Add a middleware that runs trace function.
app.use(dte.start);

// Add a route to show request traces.
app.get('/event', function (req, res, next) {
  res.trace('some.event', 'some event data');
  res.send('Hello world!');
  next();
});

// Add an after request processing middleware that runs trace.
app.use(dte.finish);

// Configure tracer.
//

app.listen(3001);
console.log('Start Test:' + process.pid);
