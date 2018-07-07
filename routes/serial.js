'use strict';
var express = require('express');
var router = express.Router();
var util = require("util");
 //var ax25 = require('th-d72-ax25');


var SerialPort	= require("serialport");
const Readline = require('@serialport/parser-readline')


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