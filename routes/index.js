var express = require('express');
var router = express.Router();
var weather = require('weather-js');
var configFile = require('../data/config.json');

var location, weatherUnit, weatherTemp, weatherCode, weatherDesc;
weather.find({search: configFile.location, degreeType: 'F'}, function(err, result) {
 if(err) console.log(err);
        //weatherRes = JSON.parse(result);
        location = result[0]['location']['name'];
        weatherUnit = result[0]['location']['degreetype'];
        weatherTemp = result[0]['current']['temperature'];
        weatherCode = result[0]['current']['skycode'];
        weatherDesc = result[0]['current']['skytext'];
console.log("It's currently "+ weatherTemp + " " + weatherUnit +" in " + location);
console.log("#dev from home page");
});

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', {
      title: 'poolPi',
      heading: 'Home',
      pageID: 'home',
      location: location,
      weatherUnit: weatherUnit,
      weatherTemp: weatherTemp,
      weatherCode: weatherCode,
      weatherDesc: weatherDesc
});

});

module.exports = router;
