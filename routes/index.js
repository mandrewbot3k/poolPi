var express = require('express');
var router = express.Router();
var weather = require('weather-js');
var configFile = require('../data/config.json');

var city, weatherUnit, weatherTemp, weatherCode, weatherDesc, weatherFeel, windSpeed, windDisplay;
city = configFile.poolinfo.city;
app = express();

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
          console.log("#dev from home page");
      });
      setTimeout(function(){
        console.log("Waiting on the weather...");
        next();
      },300);

    };

/* go get the weather! */
router.use(getWeather);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
      title: 'poolPi',
      heading: 'Home',
      pageID: 'home',
      city: city,
      weatherUnit: weatherUnit,
      weatherTemp: weatherTemp,
      weatherCode: weatherCode,
      weatherDesc: weatherDesc,
      weatherFeel: weatherFeel,
      windSpeed: windSpeed,
      windDisplay: windDisplay
    });
});

module.exports = router;
