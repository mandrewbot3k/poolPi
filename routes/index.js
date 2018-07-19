// modules
var express = require('express');
const filter = require('lodash.filter');

// files
const configFile = require('../data/config');
const devicesDB = require('../data/devices');

// shortcuts
var router = express.Router();
app = express();

// Filter buttons for relays only
var devicestats = filter(devicesDB.myDevices, { type: 'Relay' });


// globals
var city = configFile.poolinfo.city;
degreeUnit = configFile.poolinfo.degreeUnit;


/* GET home page. */
router.get('/', function(req, res, next){
  res.render('index', {
      title: 'poolPi',
      heading: 'Home',
      pageID: 'home',
      city: city,
      devices: devicestats

    });
});


module.exports = router;
