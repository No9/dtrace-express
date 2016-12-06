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

There are two ways to instrument your express application.
The first is to raise single events and allow them to be interpreted by the analysis tool.
The second is to perform latency analysis at runtime.

### event based example

```
% node examples/event-example.js
```

In a seperate console as root run 
```
# dtrace -s ./examples/event-chrome-trace.d > out.trc
```
Then open `out.trc` in the tracing tool embedded in chrome `chrome://tracing`

![](https://raw.githubusercontent.com/No9/dtrace-express/1764197e0309831fd99a1283108033ed1663b5b3/examples/tracing.png)

### latency based example 

```
% node examples/latency-example.js
```

In a seperate console as root run 

```
dtrace -s ./examples/latency-heatmap.d > out.trc
```

In another seperate console Genrate some load with artillery 

```
% npm install artillery -g
% artillery quick --duration 60 --rate 10 -n 20 http://localhost:3000/
```
Now stop the dtrace sample and do some post processing.

```
# ^C
# 'awk { print $3, $4 }' out.trc > out-prep.trc
```

And use HeatMap to generate a visualisation. 
```
# ./trace2heatmap.pl --unitstime=us --unitslatency=us out-prep.trc > heatmap.svg
```

Now open the heatmap in a browser.
![Click here to view interactive heat map](https://raw.githubusercontent.com/No9/dtrace-express/master/examples/heatmap.svg)
<img src="https://raw.githubusercontent.com/No9/dtrace-express/master/examples/heatmap.svg" />




