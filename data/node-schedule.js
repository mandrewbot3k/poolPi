var schedule = require('node-schedule');
var myschedules = require(schedule.json);
var express = require('express');


//for each myschedule
daysofweek = [1,3,5];
// START TIME
  //rules
  var startrule = new schedule.RecurrenceRule();
  startrule.hour = $$;
  startrule.minute = $$;
  startrule.daysofweek = daysofweek

  //action
  var j = schedule.scheduleJob(rule, function(){
    console.log('schedule!');
  });

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
