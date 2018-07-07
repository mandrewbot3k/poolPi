var express = require('express');
var router = express.Router();
var devicesDB = require('../data/devices.json');

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
"Relay": [{"pin": ##}] whre relay == key
*/



// create an array to store device objects in to call from
var devices = [];

//initialize the johnny-five board
board.on("ready", function() {

// initialize all devices from database...
devicesDB.forEach(function(item){
      var devType = item.type;
      var devPin= item.gpin.toString();
      var thePin = hPin + devPin;
      console.log(devType+devPin + " @ " +thePin);
      this[devType+devPin] = new five[devType](thePin);
     console.log('new device created: '+[devType+devPin]);

     // place device object in array at position equal to it's pin number
     devices[item.pin] = this[devType+devPin];
});

console.log('devices: '+ JSON.stringify(devicesDB));
console.log('devices: '+ devices);

//create mapping to device
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
    console.log(devices[pin]);
    trigger[onoff](devices[pin]);
    //devices[parseInt(pin,10)][onoff]();
    res.send({'response': "success!"});
  });

  router.get('/:pin', function(req, res){
    var thePin = hPin + req.params.pin;
    getStats = devices[req.params.pin];
    console.log('Pin Number: '+ thePin);
    console.log(getStats.isOn)
    res.send({
      'response': 'success!',
      'pin': thePin,
      'status': getStats.isOn
              });
  });


  router.get('/', function(req, res) {
  res.render('gpio', {
      title: 'GPIO RESTful API',
      heading: 'GPIO',
      pageID: 'gpio',
      body: `Use the following API calls for use:<br /><br />
        <H4>Get Status</H4> Get the status by using GET: http://host:3000/gpio/PIN
        Where PIN is the pin number. Returns block.<br />
        <h4>Trigger Device</h4> To trigger a device, use POST: http://host:3000/gpio/PIN/TYPE/onoff
        where domains for each value are: <ul>
        <li>PIN: Pin number</li>
        <li>TYPE: Relay, Button</li>
        <li>ONOFF: on, off, toggle</li>
        </ul>

      `});
  });


});
module.exports = router;
