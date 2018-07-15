var express = require('express');
var router = express.Router();
var weather = require('weather-js');
var configFile = require('../data/config.json');
const devicesDB = require('../data/devices.json');

const filter = require('lodash.filter');

var city, weatherUnit, weatherTemp, weatherCode, weatherDesc, weatherFeel, windSpeed, windDisplay, devicestats;
city = configFile.poolinfo.city;
degreeUnit = configFile.poolinfo.degreeUnit;

app = express();

var devicestats = filter(devicesDB.myDevices, { type: 'Relay' });

/* go get the weather function */
var getWeather = function (req, res, next){
    weather.find({search: city, degreeType: degreeUnit}, function(err, result) {
       if(err) console.log(err);
       weatherUnit = result[0]['location']['degreetype'],
       weatherTemp = result[0]['current']['temperature'],
       weatherCode = result[0]['current']['skycode'],
       weatherDesc = result[0]['current']['skytext'],
       weatherFeel = result[0]['current']['feelslike'],
       windSpeed = result[0]['current']['winddisplay'],
       windDisplay = result[0]['current']['windspeed']
          console.log("It's currently "+ weatherTemp + " " + weatherUnit + " in " + city + " but feels like " + weatherFeel + weatherUnit);
          console.log("#dev from status page");
      });
      setTimeout(function(){
        console.log("Waiting on the weather...");
        next();
      },1000);

    };

/* go get the weather! */
router.use(getWeather);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('status', {
      title: 'poolPi',
      heading: 'Current Status',
      pageID: 'status',
      city: city,
      weatherUnit: weatherUnit,
      weatherTemp: weatherTemp,
      weatherCode: weatherCode,
      weatherDesc: weatherDesc,
      weatherFeel: weatherFeel,
      windSpeed: windSpeed,
      windDisplay: windDisplay,
      devicestats: devicestats
    });
});

module.exports = router;
