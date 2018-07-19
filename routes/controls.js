// modules
var express = require('express');
const filter = require('lodash.filter');

// files
const configFile = require('../data/config');
const devicesDB = require('../data/devices');

// shortcuts
var router = express.Router();
app = express();

//globals
var city = configFile.poolinfo.city;
degreeUnit = configFile.poolinfo.degreeUnit;

// Filter buttons for relays only
var devicestats = filter(devicesDB.myDevices, { type: 'Relay' });



/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('controls', {
      title: 'poolPi',
      heading: 'Device Control',
      pageID: 'controls',
      city: city,
      devicestats: devicestats
    });
});

module.exports = router;
