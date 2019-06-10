# dtrace-express

A library that implements dynamic tracing for express. 

It also includes platform specific scripts to output traces for visualization.

[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)
[![CircleCI](https://circleci.com/gh/No9/dtrace-express.svg?style=svg)](https://circleci.com/gh/No9/dtrace-express)

### prereqs

#### linux

**fedora**

```bash
$ sudo dnf install elfutils-libelf-devel
```

**ubuntu**
```bash
sudo apt install libelf1 libelf-dev
```

**all**
```bash
$ git clone https://github.com/sthima/libstapsdt.git
$ cd libstapsdt
$ make
$ sudo make install
```

#### freebsd 12-0
```bash
curl http://ftp.freebsd.org/pub/FreeBSD/releases/amd64/12.0-RELEASE/src.txz > src.txz 
tar -C / -xvf src.txz
```

### install 
```
% npm install express -S
% npm install https://github.com/No9/express-tracer.git -S 
% npm install dtrace-express -S
```

### usage

There are two ways to instrument your express application.
The first is to raise single events and allow them to be interpreted by the analysis tool.
The second is to perform latency analysis at runtime.

### event example

```
% node examples/events/server.js
```

In a seperate console as root run 
```
# bpftrace -p $(pgrep node) examples/events/event.bt
```

In another seperate console Genrate some load with artillery 

```
% npm install artillery -g
% artillery quick --duration 60 --rate 10 -n 20 http://localhost:3000/event
```
Now stop the dtrace sample and do some post processing.
