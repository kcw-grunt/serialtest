'use strict';
var express = require('express');
var router = express.Router();
var ax25 = require('th-d72-ax25'); 
var util = require('util');
var dataLine = '';
var devicePath = '/dev/tty.SLAB_USBtoUART';
 //'/dev/KENWOOD_TH-D72A';

var osvar = process.platform;
console.log(osvar);
if (osvar == 'darwin') {
	console.log("Using Mac OS");
    devicePath = '/dev/tty.SLAB_USBtoUART';
}


var radiodata ="--NO RESPONSE--";
var messageContent = ""; 
var nodeCallsign = "";
var nodeSSID = 0;

 
var tnc = new ax25.kissTNC(
	{	serialPort : devicePath,
		baudRate : 9600
	}
);
 
setupTHD72A();

function setupTHD72A() {
	console.log("inside setup THD72A"); 
		tnc.sendRAWString("KISS ON");
		    setTimeout(function() {
			  tnc.sendRAWString("RESTART");
		}, 4000);
		getCallSign(); 
}

function getCallSign() {
	if (tnc) {
		tnc.sendRAWString("MYCALL"); 
	}

}

function updateLogText(str) {
	radiodata = str; 
	//.res.render('tnc', {remote_response:radiodata+"\n"+Date.now()}); //, remote_response:ct 
}

function sendTestMessage(dcs,dssid,message_tx,callback) { 
	console.log(dcs+ dssid +"\n"+ message_tx+ "\n" ); 
	var ssid_d = parseInt(dssid, 10); 
	dcs = ""+dcs;
	message_tx = ""+message_tx;
	messageContent = message_tx;
	console.log("Packet Vars:"+nodeCallsign+nodeSSID+dcs+ssid_d+messageContent);

	var testpacket = new ax25.Packet(
		{	'sourceCallsign' : nodeCallsign,
			'sourceSSID' : nodeSSID,
			'destinationCallsign' : dcs,
			'destinationSSID' : ssid_d,
			'type' : ax25.Defs.U_FRAME_UI,
			'infoString' : messageContent
		}
	); 

	var frame = testpacket.assemble();
	tnc.send(frame);
	console.log('Test message sent:'+ frame);
	radiodata = 'Test message sent' + frame; 
	//callback();
}  
 
tnc.on(
	"opened",
	function() {
		console.log("TNC opened on " + tnc.serialPort + " at " + tnc.baudRate); 
		updateLogText("TNC opened on " + tnc.serialPort + " at " + tnc.baudRate);
		//setInterval(beacon, 20000);
	}
);

tnc.on(
	"closed",
	function() {
		console.log("TNC closed on " + tnc.serialPort ); 
		updateLogText("TNC closed on " + tnc.serialPort ); 
	}
);

tnc.on(
	"written to port",
	function() {
		console.log(tnc.serialPort + "TNC written to " ); 
		updateLogText(tnc.serialPort + "TNC written to " );  
	}
);

tnc.on(
	"frame",
	function(frame) {
		var packet = new ax25.Packet({ 'frame' : frame });
		console.log(
			util.format(
				"Packet seen from %s-%s to %s-%s.",
				packet.sourceCallsign,
				packet.sourceSSID,
				packet.destinationCallsign,
				packet.destinationSSID
			)
		);
		if(packet.infoString != "")
			console.log(packet.infoString);
			radiodata = packet.infoString;
	}
);

tnc.on(
	"sent",
	function() {
		console.log(tnc.serialPort + "data sent " ); 
		updateLogText(tnc.serialPort + "data sent " );  
	}
);

tnc.on(
	"raw",
	function(data) {
		//console.log("Raw Data:", data.toString());
		if(data.toString() == "\r\n" || data.toString() == "\n") {
			////Parser to find the Callsign
			if ( dataLine.indexOf( "MYCALL" ) > -1 ) {
				var cutStr = dataLine.replace(/\s/g, "");
				if (cutStr.length > 5  && cutStr.length < 15 && cutStr.indexOf("NOCALL") == -1 ){
					cutStr = cutStr.replace("MYCALL","");
					if (cutStr.includes("-")) {
						nodeSSID = parseInt(cutStr.split("-").pop(),10);
						nodeCallsign = cutStr.split("-")[0];
						console.log("CALLSIGN:" + nodeCallsign + "\nSSID:" + nodeSSID);
					} else if (cutStr.length > 4) {
						nodeCallsign = cutStr;
						console.log("CALLSIGN:" + cutStr);
					}
				}
			}
			dataLine = "";
		} else {
			dataLine += data.toString();
			//console.log("Partial:",dataLine);
		}
 	}
)
 
router.get('/', function (req,res) { 
	res.render('tnc', { title: 'TNC Messaging', message_tx:messageContent,sourcecallsign:nodeCallsign,sourceID:nodeSSID,remote_response:radiodata+"\n"+Date.now()});
});
 
router.post('/', function (req,res) {
    //res.send('POST handler for the /tnc route');
});

router.post('/sendmessage', function (req,res) {
	var destcallsign = ""+req.body.destcs
	var destssid = req.body.ssidd
	var messagetext = ""+req.body.message

	if ( destssid.length > 0 && destcallsign.length > 0 && messagetext.length > 0) {
		console.log('Beacon Ping');	
		updateLogText('Beacon Ping');
		sendTestMessage(destcallsign,destssid,messagetext, function() {
			res.render('tnc', { title: 'TNC Messaging', message_tx:messageContent,sourcecallsign:nodeCallsign,remote_response:radiodata+"\n"+Date.now()});
		});
	} else {
		console.log('STM Failed');
		updateLogText('STM Failed');
		res.render('tnc', { title: 'TNC Messaging', message_tx:messageContent,sourcecallsign:nodeCallsign,remote_response:radiodata+"\n"+Date.now()});
	} 
  });

  //////Error Housekeeping
  process.on('unhandledRejection', (reason, promise) => {
	console.log('PROCESS : Unhandled Rejection at:', reason.stack || reason)
  })

module.exports = router;
 