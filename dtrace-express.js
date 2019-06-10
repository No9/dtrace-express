var os = require('os');

function DTE (options) {
  if (os.platform() === 'linux') {
    var USDT = require('usdt');
    this.provider = new USDT.USDTProvider('dtrace_express');
  } else {
    var d = require('dtrace-provider');
    this.provider = d.createDTraceProvider('dtrace_express');
  }
  var opts = options || {};
  this.resid = 0;
  this.latency = opts.latency;

  this.getResId = function () {
    if (this.resid >= Number.MAX_VALUE) {
      this.resid = 0;
    }
    this.resid++;
    return this.resid;
  };

  this.probe = this.provider.addProbe('trace', 'char *', 'char *', 'char *');
  this.latencyprobe = this.provider.addProbe('latency', 'char *', 'char *', 'char *', 'int', 'char *');

  this.provider.enable();

  this.fire = function (array) {
    if (array.length === 3) {
      this.probe.fire(function (p) {
        return array;
      });
    } else {
      this.latencyprobe.fire(function (p) {
        return array;
      });
    }
  };
  var that = this;
  this.instrument = function (options) {
    options.args.unshift(options.event);
    options.args.push(options.date);
    that.fire(options.args);
  };

  this.start = function (req, res, next) {
    var t = process.hrtime();
    res.start = t;
    res.id = that.getResId();
    next();
  };

  this.finish = function (req, res, next) {
    var lt = process.hrtime(res.start);
    // Start time in microseconds
    var stime = Math.round((res.start[0] * 1e9 + res.start[1]) / 1000);
    // Latency in microseconds
    var total = Math.round((lt[0] * 1e9 + lt[1]) / 1000);
    res.trace(that.getResId() + ':' + req.path, 'E', req.connection.remoteAddress, stime, total);
  };
}

module.exports = DTE;
