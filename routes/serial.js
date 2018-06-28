'use strict';
var express = require('express');
var router = express.Router();
var serialport = require('serialport'); 
var port = serialport.SerialPort; 
// var Readline = SerialPort.parsers.Readline; // make instance of Readline parser
// var parser = new Readline();
var util = require('util');
var repl = require('repl');
var devicePath = "";

// Set port path regardless of OS
serialport.list(function (err, ports) {
    ports.forEach(function(port) {
      console.log(port.comName);
      if (port.comName === '/dev/tty.SLAB_USBtoUART' || port.comName === '/dev/ttyUSB0') {
        devicePath = port.comName;
      }
    });
    console.log(devicePath);
});

port = SerialPort(devicePath,9600, function (err){
    if (err) {
        return console.log('Error: ', err.message);
    }else{
        console.log('port initialized');
    }
});


router.get('/', function (req,res) {

  
  
});


router.get('/openevent',function (req, res){
    port.on('open', () => {
        console.log('Port Opened');
      });
      
      port.write('main screen turn on', (err) => {
        if (err) { return console.log('Error: ', err.message) }
        console.log('message written');
      });
      
      port.on('data', (data) => {
        /* get a buffer of data from the serial port */
        console.log(data.toString());
      });
});

router.post('/', function (req,res) {
    res.send('POST handler for the /tnc route');
});

router.get('/sender/:senderCallsign/destination/:destCallsign', function (req,res) {

    //This sends a JSON  res.send(req.params) 
});

router.get('/sender/:senderCallsign/destination/:destCallsign/message/:messageText', function (req,res) {
    res.send(req.params)
});

router.get('/echotest/kiss', function (req,res, next) {
    port.write("Yo peeps");
    next()
}, function (req, res) {
    res.send('KISS started')
});

// router.get('/func/:funcID?', function (req,res){

//     let fun = req.query.funcId; 
//     switch (fun) {
//         case '1':
//         res.send('First is best')
//         case '2':
//         res.send('Second is ok')
//         default:
//         res.send('DEFAULT')
//     }
// });

router.get('/parser', function (req,res){
    
    const parsers = SerialPort.parsers;
    // Use a `\r\n` as a line terminator
    const parser = new parsers.Readline({
    delimiter: '\r\n'
    });

    port.pipe(parser);
    port.on('open', () => console.log('Port open'));
    parser.on('data', console.log);
    port.write('ROBOT PLEASE RESPOND\n');
});




module.exports = router;

