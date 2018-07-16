var express = require('express');
var router = express.Router();
var devs = require('../data/devices.json')

var deviceTypes, mineDevices;

var types = function(req, res, next){
  // list all device types
  devs.devices.types.forEach(function(item){
    deviceTypes = item;
    console.log(deviceTypes);
  });

  // list all devices
  devs.devices.mydevices.forEach(function(item){
    //if(err) console.log(err);
    mineDevices = item;
    console.log(mineDevices);
  })
  setTimeout(function(){
    console.log("Waiting on the devices...");
    next();
  },1000);
};

router.use(types);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('controls', {
      title: 'poolPi',
      heading: 'Controls',
      pageID: 'controls',
      mineDevices: devs

});

});

module.exports = router;
