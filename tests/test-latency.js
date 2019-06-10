var http = require('http');
var test = require('tap').test;
var path = require('path');
var spawn = require('child_process').spawn;

test('Latency Trace', function (t) {
  t.plan(5);

  var server = spawn('node', [path.join(__dirname, '/server-latency.js')]);

  server.stdout.on('data', (data) => {
    t.ok(data.toString().indexOf('Start Test') > -1, 'test server up');
    t.ok(parseInt(server.pid) > 0, 'pid exists');
    var trace = spawn('bpftrace', ['-B', 'none', '-p', server.pid, path.join(__dirname, 'latency.bt')]);
    trace.stdout.on('data', (data) => {
      // Probe atttached so lets fire the http reqquest
      if (data.toString().indexOf('Attaching') > -1) {
        setTimeout(function () {
          http.get('http://127.0.0.1:3001/event', (res) => {
            res.setEncoding('utf8');
            res.on('data', function (body) {
              t.ok(body.toString().indexOf('Hello world') > -1, 'http responded');
            });
            res.on('end', function () {
              trace.stdin.pause();
              trace.kill();
              server.stdin.pause();
              server.kill();
            });
          });
        }, 100);
      }
      if (data.toString().indexOf('latency:fired') > -1) {
        t.ok(data.toString().indexOf('latency:fired') > -1, 'response received');
        t.ok(data.toString().indexOf('/event') > -1, '/event received');
      }
    });
    trace.stderr.on('data', (data) => {
      console.log('stderr: ' + data.toString());
    });
  });
});
