var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('settings', {
    title: 'poolPi Settings',
    heading: 'Settings',
    pageID: 'settings'
  });
});

module.exports = router;
