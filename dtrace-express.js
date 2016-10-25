var d = require('dtrace-provider');
var provider = d.createDTraceProvider('dtrace-express');
var probe = provider.addProbe('trace', 'char *', 'char *');

provider.enable();

module.exports.instrument = function(options) {
   probe.fire(function(p) {
      return [options.event, options.args.join(' ')];
   });
}

module.exports.start = function(req, res, next) {
   res.start = process.hrtime();
   next();
}

module.exports.finish = function(req, res, next) {
   var t = process.hrtime(res.start);
   var total = (t[0] * 1e9 + t[1]) / 1000000 
   res.trace('finish', req.connection.remoteAddress, req.path, total);
}
