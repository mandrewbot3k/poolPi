var express = require('express');
var router = express.Router();
var devs = require('../data/devices.json')

var deviceTypes, mineDevices;

var types = function(req, res, next){
  // list all device types
  devs.devices.types.forEach(function(deviceTypes){

    console.log(deviceTypes);
  });

  // list all devices
  devs.devices.mydevices.forEach(function(mineDevices){
    //if(err) console.log(err);
    console.log(mineDevices);
  })
  next();
};

router.use(types);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('controls', {
      title: 'poolPi',
      heading: 'Controls',
      pageID: 'controls',
      myDevices: mineDevices,
      deviceTypes: deviceTypes
});

});

module.exports = router;
