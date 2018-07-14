'use strict';
var express = require('express');
var router = express.Router();   
// var SerialPort = require('serialport');
// var ax25 = require('th-d72-ax25');
// const Readline = SerialPort.parsers.Readline;
// var nodeSSID = 0;
// var nodeCallsign = "";
// var devicePath = '/dev/KENWOOD_TH-D72A';
// var dataLine = "";
// // var osvar = process.platform;
// // console.log(osvar);
// // if (osvar == 'darwin') {
// // 	console.log("Using Mac OS");
// //     devicePath = '/dev/tty.SLAB_USBtoUART';
// // }else{ 
// // 	devicePath = '/dev/ttyUSB2';
// // }
  

// var port = new SerialPort(devicePath, {
//   baudRate: 9600,
//   parity: 'none',
//   stopBits: 1,
//   dataBits: 8,
//   flowControl: false
// }, function(err) {
//   if (err){
//     console.log('error: ', err.message);
//     port.close();
// }});

// const parser = port.pipe(new Readline({ delimiter: '0a' }));

// parser.on('data', function(data) {
//     console.log("PARSER:", data);
// });

  
// setupTHD72A();
 
// function setupTHD72A() {
// 	console.log("inside setup THD72A");  
// 			sendCMD("KISS ON\r\n");  
// 		    setTimeout(function() {
// 			sendCMD("RESTART\r\n"); 
// 		}, 4000);
// 		setTimeout(function() {
// 			sendCMD("MYCALL\r\n"); 
// 		}, 2000);
// 		setTimeout(function() {
// 			sendCMD("PASSALL M\r\n"); 
// 		}, 4000); 
// }

// function sendCMD(data) {
// 	port.drain();
// 	port.write(data);
//   } 
 
// port.on('data', function(data) {
// 	//console.log("rAW", dataLine);

// 		if(data.toString() == "\r\n" || data.toString() == "\n" || data === "0a 63" || data === "0a" ) {  ///0a 63
// 			////Parser to find the Callsign
// 			if ( dataLine.indexOf( "MYCALL" ) > -1 ) {
// 				var cutStr = dataLine.replace(/\s/g, "");
// 				if (cutStr.length > 5  && cutStr.length < 15 && cutStr.indexOf("NOCALL") == -1 ){
// 					cutStr = cutStr.replace("MYCALL","");
// 					if (cutStr.includes("-")) {
// 						nodeSSID = parseInt(cutStr.split("-").pop(),10);
// 						nodeCallsign = cutStr.split("-")[0];
// 						console.log("CALLSIGN:" + nodeCallsign + "\nSSID:" + nodeSSID);
// 					} else if (cutStr.length > 4) {
// 						nodeCallsign = cutStr;
// 						console.log("CALLSIGN:" + cutStr);
// 					}
// 				}
// 			}
// 			if (dataLine.length > 2) {
// 				console.log("RAW", dataLine);
// 			}
// 			dataLine = "";
// 		} else {
// 			dataLine += data.toString();
// 			//console.log("Partial:",dataLine);
// 		}
// });

// port.on('open', function() {
//   console.log('Port Opened');
// });

// port.on('closed', function() {
//   console.log('Port Closed');
// });

// var start = Date.now();
// setInterval(function() {
//     var delta = Date.now() - start; // milliseconds elapsed since start
//      // alternatively just show wall clock time:
// 	console.log(new Date().toUTCString()); 

// 	//required to make flush work, for some reason
//     sendCMD("C KM6TIG-2\r\n");
// 	//console.log(port);
// }, 60000); // update  



router.get('/', function (req,res) { 
	res.render('terminal', { title: 'Terminal Page' });
});


module.exports = router;