var express = require('express');
var router = express.Router();
const devicesDB = require('../data/devices.json');
const filter = require('lodash.filter');

const five = require('johnny-five')
const raspi = require('raspi-io');

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

/*
Create array (require array) of devices and index them by pin number.
forEach device, generate new johnny-five object.
"Relay": [{"pin": ##}] where relay == key

var devicesDB = [
  {
    "pin": 7,
    "type": "Relay"
  },{
    "pin": 11,
    "type": "Relay"
  },{
    "pin": 13,
    "type": "Relay"
  },{
    "pin": 15,
    "type": "Relay"
  }
];
*/



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
      console.log(devType+devPin + " @ " +thePin);
      this[devType+devPin] = new five[devType](thePin);
     console.log('new device created: '+[devType+devPin]);

     // place device object in array at position equal to it's pin number
     devices[item.gpin] = this[devType+devPin];
     //console.log(devices[item.gpin] )
});

//console.log('deviceDB json: '+ JSON.stringify(devicesDB));
//console.log('devices array: '+ devices);

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
    //onoff can be on, off, toggle
    var type = req.params.type;
    var pin = req.params.pin;
    var onoff = req.params.onoff;
    //console.log(devices[pin]);

    // send off to trigger pin using trigger functions. allows for additional
    // functions or custom macros. This is the preffered method.
    trigger[onoff](devices[pin]);
    // alternate way utilzing the commands directly.
    //devices[parseInt(pin,10)][onoff]();
    res.send({'response': "success!"});
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

    res.send(ds);
  });


  router.get('/*', function(req, res) {
  res.render('gpio', {
      title: 'GPIO RESTful API',
      heading: 'GPIO',
      pageID: 'gpio'});
  });


});
module.exports = router;
