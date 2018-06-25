var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('scheduler', {
    title: 'poolPi Scheduler',
    heading: 'Scheduler',
    pageID: 'scheduler'
  });
});

module.exports = router;
