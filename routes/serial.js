'use strict';
var util = require('util');
var repl = require('repl');
var express = require('express');
var router = express.Router(); 
var SerialPort = require('serialport');
var devicePath = '/dev/ttyUSB0'; 
const parsers = SerialPort.parsers;
// Use a `\r\n` as a line terminator
const parser = new parsers.Readline({
    delimiter: '\r\n'
  });
  var port = new SerialPort(devicePath,9600);

// Set port path regardless of OS
SerialPort.list(function (err, ports) {
    ports.forEach(function(port) {
      if (port.comName === '/dev/tty.SLAB_USBtoUART' || port.comName === '/dev/ttyUSB0') {
        devicePath = port.comName;
      }
    });
    console.log('Selected port: '+ devicePath +'\n');

var port = new SerialPort(devicePath,{
        baudRate:9600,
        autoOpen:false,
        flowControl:false,
        parser: parser
    });
 
    port.write('ECHO ON \r\n', (err) => {
        if (err) { return console.log('Error: ', err.message) }
        console.log('ECHO is on');
    });

    port.write('KISS ON RESTART\r\n', (err) => {
    if (err) { return console.log('Error: ', err.message) }
    console.log('KISS is on. Restarting....');
    });

    // port.on('data', function (data) {
    //     console.log('Data:',data.toString('utf8'));
    // });
    port.on('open', showPortOpen);
    parser.on('data', readSerialData);
    port.on('close', showPortClose);
    port.on('error', showError);
 
});






function showPortOpen(){
    console.log('port open. Data rate: ' + myPort.baudRate);
}
function readSerialData(){
    console.log(data);
}
function showPortClose(){
    console.log('port closed.');
}
function showError(){
    console.log('Serial port error: ' + error);
}


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

