var WebSocketServer = require('ws').Server;
var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer();

app.use(express.static(path.join(__dirname, '/public')));

var sensordata = `{"light":474,"mois":8,"temp":26.9,"threshould":20}`;

var AWSIoTData = require('aws-iot-device-sdk');

//
// Replace the values of '<YourUniqueClientIdentifier>' and '<YourCustomEndpoint>'
// with a unique client identifier and custom host endpoint provided in AWS IoT cloud
// NOTE: client identifiers must be unique within your AWS account; if a client attempts 
// to connect with a client identifier which is already in use, the existing 
// connection will be terminated.
//
var thingShadows = AWSIoTData.thingShadow({
    keyPath: 'cert/private.pem.key',
   certPath: 'cert/certificate.pem',
     caPath: 'cert/rootCA.cert',
   clientId: 'iot-flower-website',
       host: 'XXXX.iot.XXX.amazonaws.com'
 });

//   
// Client token value returned from thingShadows.update() operation
//
var clientTokenUpdate;

//
// Simulated device values
//
var rval = 187;
var gval = 114;
var bval = 222;

thingShadows.on('connect', function() {
//
// After connecting to the AWS IoT platform, register interest in the
// Thing Shadow named 'RGBLedLamp'.
//
    thingShadows.register( 'waterflower', {}, function() {

// Once registration is complete, update the Thing Shadow named
// 'RGBLedLamp' with the latest device state and save the clientToken
// so that we can correlate it with status or timeout events.
//
// Thing shadow state
//
    //var rgbLedLampState = {"state":{"desired":{"red":rval,"green":gval,"blue":bval}}};

    //clientTokenUpdate = thingShadows.update('waterflower', rgbLedLampState  );
//
// The update method returns a clientToken; if non-null, this value will
// be sent in a 'status' event when the operation completes, allowing you
// to know whether or not the update was successful.  If the update method
// returns null, it's because another operation is currently in progress and
// you'll need to wait until it completes (or times out) before updating the 
// shadow.
//
       if (clientTokenUpdate === null)
       {
          console.log('update shadow failed, operation still in progress');
       }
    });
});

thingShadows.on('status', 
    function(thingName, stat, clientToken, stateObject) {
       console.log('stat ·received '+stat+' on '+thingName+': '+
                   JSON.stringify(stateObject.reported));
                   sensordata = JSON.stringify(stateObject.state.reported);
//
// These events report the status of update(), get(), and delete() 
// calls.  The clientToken value associated with the event will have
// the same value which was returned in an earlier call to get(),
// update(), or delete().  Use status events to keep track of the
// status of shadow operations.
//
    });

console.log(JSON.stringify(thingShadows.get('waterflower')))



thingShadows.on('foreignStateChange', 
    function(thingName, operation,stateObject) {
        console.log(JSON.stringify(thingShadows.get( 'waterflower')))
       console.log('foreignStateChange ·received delta on '+thingName+': '+
                   JSON.stringify(stateObject));
    });

    thingShadows.on('delta', 
    function(thingName, stateObject) {
        console.log(JSON.stringify(thingShadows.get( 'waterflower')))
       console.log('delta ·received delta on '+thingName+': '+
                   JSON.stringify(stateObject));
    });    

thingShadows.on('message', 
    function(topic, message) {
        console.log(JSON.stringify(thingShadows.get( 'waterflower')))
       console.log('message ·received delta on '+topic+': '+
                   JSON.stringify(message));
    });

    
thingShadows.subscribe('sensor/data');


thingShadows.on('timeout',
    function(thingName, clientToken) {
       console.log('received timeout on '+thingName+
                   ' with token: '+ clientToken);
//
// In the event that a shadow operation times out, you'll receive
// one of these events.  The clientToken value associated with the
// event will have the same value which was returned in an earlier
// call to get(), update(), or delete().
//
    });


    var wss = new WebSocketServer({server: server});
    wss.on('connection', function (ws) {
      var id = setInterval(function () {
        ws.send(sensordata, function () { /* ignore errors */ });
      }, 100);
      console.log('started client interval');
      ws.on('close', function () {
        console.log('stopping client interval');
        clearInterval(id);
      });
    });
    
    server.on('request', app);
    server.listen(3000, function () {
      console.log('Listening on http://localhost:3000');
    });
