var d = require('dtrace-provider');
var provider = d.createDTraceProvider('dtrace-express');
var probe = provider.addProbe('trace', 'char *', 'char *', 'int', 'char *');
var resid = 0;
provider.enable();

module.exports.instrument = function(options) {
   probe.fire(function(p) {
      return [options.event, options.args[0], options.args[1]];
   });
}

module.exports.start = function(req, res, next) {
   var t = process.hrtime();
   resid++;
   res.id = resid;
   res.trace(resid + ":" + req.path, "B", (t[0] * 1e9 + t[1]) / 1000 );
   next();
}

module.exports.finish = function(req, res, next) {
  var t = process.hrtime();
  res.trace(res.id+ ":" + req.path, "E",  (t[0] * 1e9 + t[1]) / 1000);
}
