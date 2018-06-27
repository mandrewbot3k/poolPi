var schedule = require('node-schedule');
var sch = require('../data/schedule.json');
var express = require('express');


//for each myschedule
sch.forEach(function(item){
daysofweek = item.daysofweek;
st = item.startTime;
console.log(st);


// START TIME
  //rules
  var startrule = []; //new schedule.RecurrenceRule();
  startrule.hour = st.h;
  startrule.minute = st.m;
  startrule.daysofweek = daysofweek;
  console.log(startrule);
}
/*
  //action
  var j = schedule.scheduleJob(rule, function(){
    console.log('schedule!');
  });*/

//END TIME



/*
second (0-59)
minute (0-59)
hour (0-23)
date (1-31)
month (0-11)
year
dayOfWeek (0-6) Starting with Sunday

*/
