# dtrace-express

A library that implements dtrace for express using the instrumentation API.

### usage

```
var dte = require('dtrace-express');
app.instrument(dte.instrument);
app.use(dte.start);
// the rest of your app.use, app.gets etc
app.use(dte.finish);
```

You can also raise custom trace events anywhere in your code.
```
app.trace('some trace info');
```

### example

```
node examples/index.js
```

In a seperate console as root run 
```
# dtrace -n ':::trace { printf("%s %s", copyinstr(arg0), copyinstr(arg1)) }'
```

And you should get out put like

```
dtrace: description ':::trace ' matched 1 probe
CPU     ID                    FUNCTION:NAME
1       67822                      trace:trace wait:before 
1       67822                      trace:trace wait:after 
1       67822                      trace:trace user.id b5tzcnjbxde75poxcagwdbo6r
1       67822                      trace:trace some.event snfye6em29r7u7i34skvgqfr 77yffhlrt1w2zz26dc20wtrzfr
1       67822                      trace:trace another.event x088v6gskn2sta8awcwpzaor hezliynwcufpkj2yac5v78pvi
1       67822                      trace:trace finish ::1 / 48.312511
```
