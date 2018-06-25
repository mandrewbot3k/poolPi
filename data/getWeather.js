var weather = require('weather-js');

var location;
location = apps.local.location;

weather.find({search: 'Escalon, CA', degreeType: 'F'}, function(err, result) {
  if(err) console.log(err);

//weatherRes = JSON.parse(result);
location = result[0]['location']['name'];
tempF = result[0]['current']['temperature']+" "+result[0]['location']['degreetype']

console.log(location);
console.log(tempF);
console.log("hello")
});
