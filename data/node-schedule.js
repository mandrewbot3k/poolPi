// modules
const ns = require('node-schedule');
const express = require('express');
const dateTime = require('date-time');
const needle = require('needle');


// files
const sch = require('../data/schedule');
const configFile = require('../data/config');
const myDs = require('../data/devices');

// globals
const hostn = 'http://poolPi:';
const port = '3000';
const host = hostn + port;


// shortcuts
app = express();

// Alert the scehdule is loading and show timezone
console.log('Schedules Loading...');
console.log('Local Time: ' + dateTime());

// Loop through all of the schedules - check for enabled later to hold index true
module.exports = {
 setTimers: function(req, res){

  // Index all the Device ID's in an array
   var locateID = [];
    myDs.myDevices.forEach(function(item){
      locateID.push(item.ID);
    })

  sch.mySchedules.forEach(function(item){
    // Read the schedules
    daysofweek = item.daysofweek;
    st = item.startTime;
    et = item.endTime;
    devID = item.deviceID;

    // create reference to johnny-five object
    // Find in the array
    var a = locateID.indexOf(devID);
    var devType = myDs.myDevices[a].type;
    var devPin = String(myDs.myDevices[a].gpin);

    console.log("[" + item.ID + "]" +item.description +":");

// check if schedule is enabled
if(item.enabled == 1){
//RULES
  // START TIME
    //rules
    // if timer is not autoOff, run the start rule, else skip start rule
    if(item.timertype != "autoOff"){
      // Set start time
      var startrule = new ns.RecurrenceRule();
      startrule.hour = st.h;
      startrule.minute = st.m;
      startrule.daysofweek = daysofweek;
      // Log the time set and fix minutes for log display:
      if (startrule.minute == 0){displayStartMin = "0"+startrule.minute;}
      else {displayStartMin = startrule.minute};
      console.log("Timer Start: " + startrule.hour + ":" + displayStartMin);

          // Add Start Action here
          var j = ns.scheduleJob(startrule, function(){
            var api = '/gpio';

            var j5 = '/' + devPin + '/' + devType +'/';
            var j5fun = 'on';
            var str = api + j5 + j5fun;
            var url = host + str;

            // post command to GPIO API
            needle.post(url, {}, function(err, resp){
              if(err){console.log(err)};
              //console.log(resp);
            })

            console.log('Turning ON: ' + item.name + ' ' + item.description + ' w/Start Rule: #' + item.ID + ' at ' + dateTime());
          });
    };
     //end != autoOff if

    //End Time
      var endrule = new ns.RecurrenceRule();
      endrule.hour = et.h;
      endrule.minute = et.m;
      endrule.daysofweek = daysofweek;
      // Log the time set and fix minutes for log display:
      if (endrule.minute == 0){displayEndMin = "0" + endrule.minute;}
      else {displayEndMin = endrule.minute};
      console.log("Timer End: " + endrule.hour +":"+ displayEndMin);

          // Add end action here
          var j = ns.scheduleJob(endrule, function(){
            var api = '/gpio';
            // /gpio/7/Relay/toggle
            var j5 = '/' + devPin + '/' + devType +'/';
            var j5fun = 'off';
            var str = api + j5 + j5fun;
            var url = host + str;

            // post command to GPIO API
            needle.post(url, {}, function(err, resp){
              if(err){console.log(err)};
              //console.log(resp);
            })

            console.log('Turning OFF ' + item.name + ' ' + item.description + ' w/End Rule: #' + item.ID + ' at '  + dateTime());
          });
  }; //end if
  });
}};
