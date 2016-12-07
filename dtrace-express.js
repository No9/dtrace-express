var d = require('dtrace-provider');

function Tracer() {
}


function DTE(options) {

   this.provider = d.createDTraceProvider('dtrace-express');
   var opts = options || {};
   this.resid = 0;
   this.latency = opts.latency;

   if(options.latency) {
      this.probe = this.provider.addProbe('trace', 'char *', 'char *', 'int', 'char *');
   } else {
      this.probe = this.provider.addProbe('trace', 'char *');
   }
   this.provider.enable();
   
   this.fire = function (array) {
     this.probe.fire(function(p) {   
        return array;
     }); 
   };
   var that = this;
   this.instrument = function(options) {
   if(that.latency) {
      that.fire([options.event, options.args.join(' ')]);
   } else {
      that.fire([options.event, options.args[0], options.args[1]]);
   }
   };

   this.start = function (req, res, next) {
   if(this.latency) {
      var t = process.hrtime();
      this.resid++;
      res.id = this.resid;
      res.trace(this.resid + ':' + req.path, 'B', (t[0] * 1e9 + t[1]) / 1000 );
      next();

   } else {
      res.start = process.hrtime();
      next();
   }
   };

   this.finish = function(req, res, next) {
   if (that.latency) {

      var lt = process.hrtime(res.start);
      // Start time in microseconds
      var stime = Math.round((res.start[0] * 1e9 + res.start[1]) / 1000);
   
      // Latency in microseconds 
      var total = Math.round((lt[0] * 1e9 + lt[1]) / 1000); 
      res.trace('finish', req.connection.remoteAddress, req.path, stime, total);

   } else {
      var et = process.hrtime();
      res.trace(res.id+ ':' + req.path, 'E',  (et[0] * 1e9 + et[1]) / 1000);
   }
};
}

module.exports = DTE;
