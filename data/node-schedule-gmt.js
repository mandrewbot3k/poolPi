// Use this instead of node-schedule.js if using non-local time on system

var schedule = require('node-schedule');
var sch = require('../data/schedule.json');
var express = require('express');
var dateTime = require('date-time');
var configFile = require('../data/config.json');

app = express();

// Alert the scehdule is loading and show timezone
console.log('Schedules Loading...');
var timezone = configFile.poolinfo.timezone + configFile.poolinfo.daylightSavings;
if(configFile.poolinfo.daylightSavings == 1){
  console.log("Daylight Savings is in effect");
}
console.log('The current timezone is ' + timezone + ':00 GMT');
console.log('Local Time: ' + dateTime());

// Loop through the schedules
module.exports = {
 setTimers: function(req, res){
  sch.forEach(function(item){

  if(item.enabled == 1){
    // Read the schedule
    daysofweek = item.daysofweek;
    st = item.startTime;
    et = item.endTime;

    console.log("[" + item.ID + "]" +item.description +":");
//RULES
  // START TIME
    //rules
    if(item.timertype != "autoOff"){
      // Set start time
      var startrule = new schedule.RecurrenceRule();
      // adjust for timezone from config.json
      startrule.hour = st.h - timezone;
      //fix timezone adjustment and modify days of week for GMT
      var startdays = daysofweek
            if (startrule.hour >= 24){
              startrule.hour = startrule.hour - 24;
              console.log('og days of week: ' + daysofweek);
              startdays = [];
              //loop thru array
              daysofweek.forEach(function(day){
                day = day + 1;
                if(day == 7){day=0;}; // adjust saturday -> sunday
                startdays.push(day);
              });//end loop
            };
      startrule.minute = st.m;
      startrule.daysofweek = startdays.sort(function(a, b){return a-b});
      // Log the time set and fix minutes for log display:
      if (startrule.minute == 0){
          displayStartMin = "00";
        }
        else {
          displayStartMin = startrule.minute;
        }

      console.log("Timer Start: " + startrule.hour + ":" + displayStartMin);

      // Add Start Action here
      var j = schedule.scheduleJob(startrule, function(){
        console.log(item.name + ' ' + item.description + ' Start Rule: #' + item.ID + '... Start Time: ' + dateTime());
        });
    };
     //end autoOff if

    //End Time
      var endrule = new schedule.RecurrenceRule();
      // Adjust for timezone from config.json
      endrule.hour = et.h - timezone;
      // Fix timezone adjustment
      var endofdays = daysofweek
            if (endrule.hour >= 24){
              endrule.hour = endrule.hour - 24
              endofdays = [];
              //loop thru array
              daysofweek.forEach(function(day){
                day = day + 1;
                if(day == 7){day=0;}; // adjust saturday -> sunday
                endofdays.push(day);
              });//end loop
            };
      endrule.minute = et.m;
      endrule.daysofweek = endofdays.sort(function(a, b){return a-b});
      console.log(endofdays);
      // Log the time set and fix minutes for log display:
      if (endrule.minute == 0){
          displayEndMin = "00";
        }
        else {
          displayEndMin = endrule.minute;
        }
      console.log("Timer End: " + endrule.hour +":"+ displayEndMin);

      // Add end action here
      var k = schedule.scheduleJob(endrule, function(){
        console.log(item.name + ' ' + item.description + ' End Rule: #' + item.ID + '... End Time: '  + dateTime());
        });
  }; //end if
  });
}};
