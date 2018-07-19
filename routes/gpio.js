// modules
var express = require('express');
const needle = require('needle');
const five = require('johnny-five')
const raspi = require('raspi-io');
const filter = require('lodash.filter');
const io = require('socket.io-client');

//files
const devicesDB = require('../data/devices');

// shortcuts
var router = express.Router();
const hostn = 'http://poolPi:';
const port = '3000';
const host = hostn + port;
const socket = io.connect(host);

// globals
const board = new five.Board({
      repl: false,
      io: new raspi(),
});

/*
/Use physical pins on piZero. Pins are transformed into header format ie, "pin": 7 => "P1-7")\
Set hPin to 'GPIO', 'P1-', or '' for WiringPi;
More info here: https://github.com/nebrius/raspi-io/wiki/Pin-Information

*/

const hPin = 'P1-';

// inputs are pull - "up" or "down" using internal resistors
const pud = "down";

/*
Create array (require array) of devices and index them by pin number.
forEach device, generate new johnny-five object.
"Relay": [{"pin": ##}] where relay == key

var devicesDB = [
  {
    "pin": 7,
    "type": "Relay",
    "pinAction" : null
  },{
    "pin": 11,
    "type": "Relay",
    "pinAction" : null
  },{
    "pin": 13,
    "type": "Relay",
    "pinAction" : null
  },{
    "pin": 31,
    "type": "Button",
    "pinAction" : 7
  }
];
*/

socket.on('connect', () => {
  console.log(socket.id); // 'G5p5...'
});

// create an array to store device objects in to call from
var devices = [];

// Get the relays
var relayStatus = filter(devicesDB.myDevices, { type: 'Relay' });


//initialize the johnny-five board
board.on("ready", function() {

  // initialize all devices from database...
  devicesDB.myDevices.forEach(function(item){
        var devType = item.type;
        var devPin= item.gpin.toString();
        var thePin = hPin + devPin;
        var actPin = item.pinAction;

        console.log(devType+devPin + " @ " +thePin);
        if(devType=="Button" && actPin !== null){
          this[devType+devPin] = new five[devType]({pin: thePin, isPulldown: true});

          // Button Functions
          // Toggle the relays on 'bump'
          this[devType+devPin].on("down", function() {
              var url = host+'/gpio/'+actPin+'/Relay/toggle';
              needle.post(url);
            })
        }
        else{
          this[devType+devPin] = new five[devType](thePin);
        }
       console.log('New device created: '+[devType+devPin]);
       // place device object in array at position equal to it's pin number
       devices[item.gpin] = this[devType+devPin];
  });

// board cleanup on exit
this.on("exit",function(){
  devicesDB.myDevices.forEach(function(item){
    if(item.type=="Relay"){
      devices[item.gpin].off();
    }
  })

})


// Relay functions
  var trigger = {
    toggle: (device) => {
              device.toggle();
            },
    on:     (device) => {
              device.on();
            },
    off:    (device) => {
              device.off();
            }
  };

/* GET home page. */
  router.post('/:pin/:type/:onoff', function(req, res){
    //type can be Relay, Led, Button
    //onoff can be on, off, toggle (toggle not fully supported with socket.io)
    var type = req.params.type;
    var pin = req.params.pin;
    var onoff = req.params.onoff;
    grabDevice = devices[pin]
    var toggleStatus = !grabDevice.isOn;
    // websocket through socket.io
    var msg;
    if(onoff == "on"){msg = true}else if(onoff == "off"){msg=false}else{msg=toggleStatus};
    //send button status to server
    socket.emit("pinChange", {"pin": parseInt(pin), "method": onoff, "status": msg});

    // send off to trigger pin using trigger functions. allows for additional
    // functions or custom macros. This is the preferred method.
    trigger[onoff](devices[pin]);
    // alternate way utilzing the commands directly.
    //devices[parseInt(pin)][onoff]();
    res.send({'Pin' : pin, 'Method' : onoff, 'Response': "Success!" });
  });

  router.get('/:pin', function(req, res, next){
    if (isNaN(parseInt(req.params.pin))){
      next();
    }
    else {
      var thePin = hPin + req.params.pin;
      grabDevice = devices[req.params.pin];
      console.log('Pin Number: '+ thePin);
      console.log(grabDevice.isOn)
      res.send({
        'response': 'success!',
        'pin': thePin,
        'status': grabDevice.isOn
      });
    }
  });

  router.get('/pinstatus', function(req, res, next){
    var ds = [];
    relayStatus.forEach(function(item){
      var d = this[item.type+item.gpin.toString()];
      ds[item.gpin] = d.isOn;
      console.log(ds[item.gpin]);
    })

    res.send({'ds': ds});
  });

  router.get('/*', function(req, res) {
    res.render('gpio', {
        title: 'GPIO RESTful API',
        heading: 'GPIO',
        pageID: 'gpio'});
  });


}); // j5 board
module.exports = router;
