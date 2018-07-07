'use strict';
var express = require('express');
var router = express.Router();
var util = require("util");
var ax25 = require('th-d72-ax25');


var devicePath = '/dev/ttyUSB0';
var osvar = process.platform;
console.log(osvar);
if (osvar == 'darwin') {
	console.log("Using Mac OS");
    devicePath = '/dev/tty.SLAB_USBtoUART';
}else{ 
	devicePath = '/dev/ttyUSB0';
}


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

 
var tnc = new ax25.kissTNC(
    {	'serialPort' : devicePath,
        'baudRate' : 9600
    }
);
 
var beacon = function() {
    var packet = new ax25.Packet(
        {	sourceCallsign : "MYCALL",
            destinationCallsign : "BEACON",
            type : ax25.U_FRAME_UI,
            infoString : "Hello world!"
        }
    );
    var frame = packet.assemble();
    tnc.send(frame);
    console.log("Beacon sent.");
}
 
tnc.on(
    "error",
    function(err) {
        console.log(err);
    }
);
 
tnc.on(
    "opened",
    function() {
        console.log("TNC opened on " + tnc.serialPort + " at " + tnc.baudRate);
        setInterval(beacon, 30000); // Beacon every 30 seconds - excessive!
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
    }
);




router.get('/sendmessage', function (req,res) { 
    console.log('form info');
});
module.exports = router;