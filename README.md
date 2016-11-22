# dtrace-express

A library that implements dtrace for express. 

It also includes a D script to output info in chrome tracing format to view response times visually.

### usage

```
var express = require('express');
var expresstracer = require('express-tracer');
var dte = require('dtrace-express');

var app = express();
expresstracer(app);

// Add a middleware that fires at the start of a request.
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
console.log('Express started on port 3000');ar dte = require('dtrace-express');
```

### example

```
% node examples/index.js
```

In a seperate console as root run 
```
# dtrace -s ./examples/chome-out.d > out.trc
```
Then open `output.trc` in the tracing tool embedded in chrome `chrome://tracing`

