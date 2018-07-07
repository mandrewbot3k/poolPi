var schedule = require('node-schedule');
var sch = require('../data/schedule.json');
var express = require('express');
var dateTime = require('date-time');
var configFile = require('../data/config.json');

app = express();

// Alert the scehdule is loading and show timezone
console.log('Schedules Loading...');
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
      startrule.hour = st.h;
      startrule.minute = st.m;
      startrule.daysofweek = daysofweek;
      // Log the time set and fix minutes for log display:
      if (startrule.minute == 0){displayStartMin = "00"}
      else {displayStartMin = startrule.minute};
      console.log("Timer Start: " + startrule.hour + ":" + displayStartMin);
      // Add Start Action here
      var j = schedule.scheduleJob(startrule, function(){
        console.log(item.name + ' ' + item.description + ' Start Rule: #' + item.ID + '... Start Time: ' + dateTime());
        });
    };
     //end != autoOff if

    //End Time
      var endrule = new schedule.RecurrenceRule();
      endrule.hour = et.h;
      endrule.minute = et.m;
      endrule.daysofweek = daysofweek;
      // Log the time set and fix minutes for log display:
      if (endrule.minute == 0){displayEndMin = "00"}
      else {displayEndMin = endrule.minute};
      console.log("Timer End: " + endrule.hour +":"+ displayEndMin);
      // Add end action here
      var k = schedule.scheduleJob(endrule, function(){
        console.log(item.name + ' ' + item.description + ' End Rule: #' + item.ID + '... End Time: '  + dateTime());
        });
  }; //end if
  });
}};
