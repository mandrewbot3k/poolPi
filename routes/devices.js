// modules
var express = require('express');

//shortcuts
var router = express.Router();

// files
var devs = require('../data/devices')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('devices', {
      title: 'poolPi',
      heading: 'Devices',
      pageID: 'devices',
      data: devs.myDevices
});

});

module.exports = router;
