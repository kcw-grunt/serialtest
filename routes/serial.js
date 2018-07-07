'use strict';
var express = require('express');
var router = express.Router();
var util = require("util");
var SerialPort	= require("serialport"); 
var SerialPort = serialport.SerialPort; // localize object constructor
 
var sp = new SerialPort("/dev/tty-usbserial1", {
  parser: serialport.parsers.raw
});


//const Readline = require('@serialport/parser-readline')
 //var ax25 = require('th-d72-ax25');


var devicePath = '/dev/ttyUSB0';
var osvar = process.platform;
console.log(osvar);
if (osvar == 'darwin') {
	console.log("Using Mac OS");
    devicePath = '/dev/tty.SLAB_USBtoUART';
}else{ 
	devicePath = '/dev/ttyUSB0';
}
 
var port = new SerialPort(devicePath, function (err) {
	if (err) {
	  return console.log('Error: ', err.message);
	}
  });
   
  port.write('main screen turn on', function(err) {
	if (err) {
	  return console.log('Error on write: ', err.message);
	}
	console.log('message written');
  });

  port.write('KISS ON\r\n', function(err) {

  });

  port.on("data", function (data) {
	sys.puts("here: "+data);
  });


  port.write('IT WORKS\r\n', function(err) {

});




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