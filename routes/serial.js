'use strict';
var express = require('express');
var router = express.Router(); 
var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
//const Readline = SerialPort.parsers.Readline;  
var devicePath = '/dev/KENWOOD_TH-D72A';
var dataLine = [];
// var osvar = process.platform;
// console.log(osvar);
// if (osvar == 'darwin') {
// 	console.log("Using Mac OS");
//     devicePath = '/dev/tty.SLAB_USBtoUART';
// }else{ 
// 	devicePath = '/dev/ttyUSB2';
// }
    
var port = new SerialPort(devicePath, {
  baudRate: 9600,
  parity: 'none',
  stopBits: 1,
  dataBits: 8,
  flowControl: false
}, function(err) {
  if (err){
    console.log('error: ', err.message);
    port.close();
}});

 
port.write('KISS ON\r\n', function(err) {
  console.log('KISS ON Turned on');
});

port.write('RESTART\r\n', function(err) {
  console.log('Restarted');
});

port.on('data', function(data) {

  // if(data =='0D 0A') {
  //   console.log('Date line:'+ dataline)
  // } else {
  //   dataLine.push(data);
  // }
  console.log('Data:', data);
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