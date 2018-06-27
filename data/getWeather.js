var express = require('express');
var weather = require('weather-js');
var configFile = require('../data/config.json');

var gg = function(req, res, next){
      weather.find({search: configFile.poolinfo.city, degreeType: configFile.poolinfo.degreeUnit}, function(err, result) {
       if(err) console.log(err);
                 city = result[0]['location']['name'];
          weatherUnit = result[0]['location']['degreetype'];
          weatherTemp = result[0]['current']['temperature'];
          weatherCode = result[0]['current']['skycode'];
          weatherDesc = result[0]['current']['skytext'];
          weatherFeel = result[0]['current']['feelslike'];
            windSpeed = result[0]['current']['winddisplay'];
          windDisplay = result[0]['current']['windspeed'];
      console.log("It's currently "+ weatherTemp + " " + weatherUnit + " in " + city + " but feels like " + weatherFeel + weatherUnit);
      console.log("#dev from home page");
    });
    next();
  };

module.exports = gg;
