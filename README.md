# dtrace-express

A library that implements dtrace for express. 

It also includes a D script to output info in chrome tracing format to view response times visually.

### install 
```
% npm install express -S
% npm install express-tracer -S 
% npm install dtrace-express -S
```

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
# dtrace -s ./examples/chrome-out.d > out.trc
```
Then open `out.trc` in the tracing tool embedded in chrome `chrome://tracing`

![](https://raw.githubusercontent.com/No9/dtrace-express/1764197e0309831fd99a1283108033ed1663b5b3/examples/tracing.png)

