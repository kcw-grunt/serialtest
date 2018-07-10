'use strict';
var express = require('express');
var router = express.Router(); 
var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
var util = require("util"), repl = require("repl");

serialport.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(port.comName);
    console.log(port.pnpId);
    console.log(port.manufacturer);
  });
});

  

var devicePath = '/dev/ttyUSB2';

var osvar = process.platform;
console.log(osvar);
if (osvar == 'darwin') {
	console.log("Using Mac OS");
    devicePath = '/dev/tty.SLAB_USBtoUART';
}else{ 
	devicePath = '/dev/ttyUSB2';
}
 
  ///,
  //parser: SerialPort.parsers.raw
var port = new SerialPort( devicePath, { // change path
  baudrate: 9600
, function ( err ) {
  if ( err ) {
    console.error('error opening serial port:' , err);
  }
}
});

port.on('data', function(data) {
  console.log(data)
});
 
port.write('KISS ON\r\n', function(err) {
  console.log('KISS ON Turned on');
});

port.write('RESTART\r\n', function(err) {
  console.log('Restarted');
});

port.on('open', function() {
  console.log('Port Opened');
});

port.on('closed', function() {
  console.log('Port Closed');
});

var start = Date.now();
setInterval(function() {
    var delta = Date.now() - start; // milliseconds elapsed since start
     // alternatively just show wall clock time:
    console.log(new Date().toUTCString());
    port.write('I\r\n');
    port.write('Hi Mom!');
    port.write(new Buffer('Hi Mom!'));
}, 5000); // update  



router.get('/', function (req,res) { 
	res.render('terminal', { title: 'Terminal Page' });
});


module.exports = router;