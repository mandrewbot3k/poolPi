// modules
var express = require('express');
const needle = require('needle');
const five = require('johnny-five')
const raspi = require('raspi-io');
const filter = require('lodash.filter');
const io = require('socket.io-client');
const dateFormat = require('dateformat');
const fs = require('fs');

//files
const devicesDB = require('../data/devices');

// shortcuts
var router = express.Router();
const hostn = 'http://localhost:';
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
  console.log("Socket ID: " + socket.id + "  Established: " + dateFormat(Date.now(), "dddd, mmmm dS, yyyy, h:MM:ss TT")); // 'G5p5...'
});

// create an array to store device objects in to call from
var devices = [];

/*
create an array to log activity
devLog = [
  {
  "Relay7": [{
    "last" : {
          "on": {"time": 1532037665991, "src" : null},
          "off": {"time": 1532037655548, "src" : null}
          }
    },{
      "log" : {
        "on": [
          {"time": 1532037665991, "src" : null},
          {"time": 1532037665991, "src" : null}
       ],
        "off": [
          {"time": 1532037665991, "src" : null},
          {"time": 1532037665991, "src" : null}
       ]
     }}
  ],
  "Relay11": [{
    "last" : {
          "on": {  "time": 1532037665991, "src" : null},
          "off": {"time": 1532037655548, "src" : null}
          }
    },{
      "log" : {
        "on": [
          {"time": 1532037665991,"src" : null},
          {"time": 1532037665991,"src" : null}
       ],
        "off": [
          {"time": 1532037665991,"src" : null},
          {"time": 1532037665991,"src" : null}
       ]
     }}
  ]
}
]
*/
var devLog = [JSON.parse(fs.readFileSync('./data/devLog.json', "utf8"))];

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

    //console.log(devType+devPin + " @ " +thePin);
        if(devType=="Button" && actPin !== null){
          this[devType+devPin] = new five[devType]({pin: thePin, isPulldown: true});

          // Button Functions
          // Toggle the relays on 'bump'
          this[devType+devPin].on("down", function() {
              var url = host+'/gpio/'+actPin+'/Relay/toggle';
              needle.post(url, {src: "Button"});
            })
        }
        else{
          this[devType+devPin] = new five[devType](thePin);
        }
    //console.log('New device created: '+[devType+devPin]);
       // place device object in array at position equal to it's pin number
       devices[item.gpin] = this[devType+devPin];
  });

var pushLog = (obj, onoff, src) => {
  console.log("pushLog: " + obj + "   " + onoff + "   " + src);
    var dt = Date.now();
    // default structure
    var defObj = { last: { on: { time: null, src: null }, off: { time: null, src: null }},  log: { on: [], off: [] } };
    // check if device exists in log, if not create
    if(!devLog[0][obj]){
      devLog[0][obj] = defObj;
    }
    // Update log
    devLog[0][obj]["last"][onoff] = {time: dt, src: src};
    devLog[0][obj]["log"][onoff].push({time: dt, src: src});
}

var writeLog = () => fs.writeFile("./data/devLog.json", JSON.stringify(devLog[0], null, 2), 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }
    console.log("Log Updated");
  });

// board cleanup on exit
this.on("exit",function(){
  devicesDB.myDevices.forEach(function(item){
    if(item.type=="Relay"){
      devices[item.gpin].off();
    }
  })
});

// Relay functions
  var trigger = {
    toggle: (device, cb) => {
              device.toggle();
              cb();
            },
    on:     (device, cb) => {
              device.on();
              cb();
            },
    off:    (device, cb) => {
              device.off();
              cb();
            }
  };

/* GET home page. */
  router.post('/:pin/:type/:onoff', function(req, res){
    //type can be Relay, Led, Button
    //onoff can be on, off, toggle (toggle not fully supported with socket.io)
    var type = req.params.type;
    var pin = req.params.pin;
    var onoff = req.params.onoff;
    if(req.body.src){
      var src = req.body.src;
    }
    else{var src = null;}

    grabDevice = devices[pin]
    var toggleStatus = !grabDevice.isOn;
    // websocket through socket.io
    var msg;
    console.log(src + "    " +   pin);
    if(onoff == "on"){
        msg = true;
        if(toggleStatus == true){
          pushLog(pin, onoff, src);
        }
      }
      else if(onoff == "off"){
        msg = false;
        if(toggleStatus == false){
          pushLog(pin, onoff, src);
        }
      }
      else{
        msg = toggleStatus;
        if(toggleStatus == true){
          pushLog(pin, "off", src);
        }
        else{
          pushLog(pin, "on", src);
        }

    };
    //send button status to server
    socket.emit("pinChange", {"pin": parseInt(pin), "method": onoff, "status": msg});

    // send off to trigger pin using trigger functions. allows for additional
    // functions or custom macros. This is the preferred method. callback function writes to log

  trigger[onoff](devices[pin],writeLog);


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

  router.get('/log', function(req, res, next){
    app.set('json spaces', 2);
    var readLog = JSON.parse(fs.readFileSync('./data/devLog.json', "utf8"));
    res.json(readLog)
  })

  router.get('/*', function(req, res) {
    res.render('gpio', {
        title: 'GPIO RESTful API',
        heading: 'GPIO',
        pageID: 'gpio'});
  });


}); // j5 board
module.exports = router;
