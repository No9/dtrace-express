var d = require('dtrace-provider');
var resid = 0;

function Tracer() {
   this.provider = d.createDTraceProvider('dtrace-express');
   this.probe = this.provider.addProbe('trace', 'char *', 'char *', 'int', 'char *');
   this.provider.enable();
}

Tracer.prototype.fire = function (array) {
     this.probe.fire(function(p) {   
        return array;
     }); 
};

var tracer = new Tracer();

module.exports.eventinstrument = function(options) {
   tracer.fire([options.event, options.args[0], options.args[1]]);
};

module.exports.eventstart = function(req, res, next) {
   var t = process.hrtime();
   resid++;
   res.id = resid;
   res.trace(resid + ':' + req.path, 'B', (t[0] * 1e9 + t[1]) / 1000 );
   next();
};

module.exports.eventfinish = function(req, res, next) {
  var t = process.hrtime();
  res.trace(res.id+ ':' + req.path, 'E',  (t[0] * 1e9 + t[1]) / 1000);
};

module.exports.latencyinstrument = function(options) {
   tracer.fire([options.event, options.args.join(' ')]);
};

module.exports.latencystart = function(req, res, next) {
      res.start = process.hrtime();
      next();
};

module.exports.latencyfinish = function(req, res, next) {
      var t = process.hrtime(res.start);

      // Start time in microseconds
      var stime = Math.round((res.start[0] * 1e9 + res.start[1]) / 1000);
   
      // Latency in microseconds 
      var total = Math.round((t[0] * 1e9 + t[1]) / 1000); 
      res.trace('finish', req.connection.remoteAddress, req.path, stime, total);
};
