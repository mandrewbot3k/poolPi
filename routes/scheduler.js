var express = require('express');
var router = express.Router();
var sch = require('../data/schedule.json');
var dateTime = require('date-time');
var configFile = require('../data/config.json');

app = express();
console.log('hello from the scheduler');

var timezone = configFile.poolinfo.timezone;



/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('scheduler', {
    title: 'poolPi Scheduler',
    heading: 'Scheduler',
    pageID: 'scheduler'
  });
});

module.exports = router;
