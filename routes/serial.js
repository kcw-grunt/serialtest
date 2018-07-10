'use strict';
var express = require('express');
var router = express.Router();
var util = require("util"); 
const SerialPort = require('serialport')
const Delimiter = require('@serialport/parser-delimiter')
 

var devicePath = '/dev/ttyUSB0';
var osvar = process.platform;
console.log(osvar);
if (osvar == 'darwin') {
	console.log("Using Mac OS");
    devicePath = '/dev/tty.SLAB_USBtoUART';
}else{ 
	devicePath = '/dev/ttyUSB0';
}
 
 
var port = new SerialPort(devicePath, {
  baudRate:9600,
  parser:serialport.parsers.raw
});  

 
   
port.on('data', function(data) {
  console.log('Port Data');
  sys.puts("here:"+data);
  });

const parser = port.pipe(new Delimiter({ delimiter: '\n' }))
parser.on('data', console.log)

  port.write('KISS ON\r\n', function(err,result) {
	console.log('KISS ON Turned on'+result);
  });

  port.write('RESTART\r\n', function(err,result) {
    console.log('Restarted'+result);
  });

  port.on('open', function() {
	console.log('Port Opened');
  });

  port.on('closed', function() {
	console.log('Port Closed');
  });

  port.on('readable', function() {
	console.log('Data:', port.read());
  });

  port.on("data", function (data) {
	console.log('here: '+data);
  });

 
  port.write('IT WORKS\r\n', function(err) {
	//console.log('DOES IT?');

  });

  function readSerialData(data) {
    console.log("Reading Serail Data:\n")
    console.log(data);
  }

  var start = Date.now();
  setInterval(function() {
      var delta = Date.now() - start; // milliseconds elapsed since start
      console.log(Math.floor(delta / 5000)); // in seconds
      // alternatively just show wall clock time:
      console.log(new Date().toUTCString());
      port.write('DISP\r\n');
  }, 5000); // update about every second



router.get('/', function (req,res) { 
	res.render('terminal', { title: 'Terminal Page' });
});

// /* GET Hello World page. */
// router.get('/terminal', function(req, res) {
//     //res.render('terminal', { title: 'Hello, Terminal' });
//     res.send('GET Handler for the /terminal endppint');
// });
      
// router.post('/terminal', function(req, res) {
//     //res.render('terminal', { title: 'Hello, Terminal' });
//     res.send('POST Handler for the /terminal endppint');
// });

  



router.get('/sendmessage', function (req,res) { 
    console.log('form info');
});
module.exports = router;