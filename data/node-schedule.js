var schedule = require('node-schedule');
var sch = require('../data/schedule.json');
var express = require('express');
var dateTime = require('date-time');
var configFile = require('../data/config.json');
const myDs = require('../data/devices.json');
const needle = require('needle');

app = express();

// Alert the scehdule is loading and show timezone
console.log('Schedules Loading...');
console.log('Local Time: ' + dateTime());

// Loop through the schedules
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
    var a = locateID.indexOf(devID);
    var devType = myDs.myDevices[a].type;
    var devPin = toString(myDs.myDevices[a].gpin);

    console.log("[" + item.ID + "]" +item.description +":");

if(item.enabled == 1){
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

        // set the host name for path
        var host = 'http://' + req.headers.host;
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
      var endrule = new schedule.RecurrenceRule();
      endrule.hour = et.h;
      endrule.minute = et.m;
      endrule.daysofweek = daysofweek;
      // Log the time set and fix minutes for log display:
      if (endrule.minute == 0){displayEndMin = "00"}
      else {displayEndMin = endrule.minute};
      console.log("Timer End: " + endrule.hour +":"+ displayEndMin);
      // Add end action here
      var j = schedule.scheduleJob(endrule, function(){

        // set the host name for path
        var host = 'http://' + req.headers.host;
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
