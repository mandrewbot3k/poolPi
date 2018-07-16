// modules
const express = require('express');
const dateTime = require('date-time');

// files
var configFile = require('../data/config');
var sch = require('../data/schedule');

//shortcuts
var router = express.Router();
app = express();

//globals
var schedule = sch.mySchedules;
var timezone = configFile.poolinfo.timezone;

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('scheduler', {
    title: 'poolPi Scheduler',
    heading: 'Scheduler',
    pageID: 'scheduler',
    schedule: schedule
  });
});

module.exports = router;
