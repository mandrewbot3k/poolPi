// modules
const ns = require('node-schedule');
const express = require('express');
const dateTime = require('date-time');
const needle = require('needle');
const fs = require('fs');

// files
//const sch = require('../data/schedule');
//var sch = JSON.parse(fs.readFileSync('./data/schedule.json','utf8'));

const configFile = require('../data/config');
const myDs = require('../data/devices');

// globals
const hostn = 'http://localhost:';
const port = '3000';
const host = hostn + port;

var schJobs = [];
// shortcuts
app = express();

// Alert the scehdule is loading and show timezone
console.log('Schedules Loading...');
console.log('Local Time: ' + dateTime());

// Loop through all of the schedules
module.exports = {

 setTimers: ()=>{
   /*
   fs.readFile('./data/schedule.json', (err, data) => {
       if (err) throw err;
       sch = JSON.parse(data);
       //console.log(JSON.stringify(sch, null, 2));
   });*/
   var sch = JSON.parse(fs.readFileSync('./data/schedule.json','utf8'));
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
    var enab = '';
    if(!item.enabled){enab = " [DISABLED] "}
    var theLog = "[" + item.ID + "]" + enab + item.description +":" ; ;
    var jobAr = [];

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
      if (startrule.minute < 10){displayStartMin = "0"+startrule.minute;}
      else {displayStartMin = startrule.minute};
      theLog = theLog + " Timer Start: " + startrule.hour + ":" + displayStartMin;

          // Add Start Action here
          var j = ns.scheduleJob(startrule, function(){
            var api = '/gpio';

            var j5 = '/' + devPin + '/' + devType +'/';
            var j5fun = 'on';
            var str = api + j5 + j5fun;
            var url = host + str;

            if(item.enabled == 1){
              // post command to GPIO API
              needle.post(url, {src : "Timer"+item.ID }, function(err, resp){
                if(err){console.log(err)};
                //console.log(resp);
              })
              console.log('Turning ON: ' + item.name + ' ' + item.description + ' w/Start Rule: #' + item.ID + ' at ' + dateTime());
            }
          });
          jobAr.push(j);

    };
     //end != autoOff if

    //End Time
      var endrule = new ns.RecurrenceRule();
      endrule.hour = et.h;
      endrule.minute = et.m;
      endrule.daysofweek = daysofweek;
      // Log the time set and fix minutes for log display:
      if (endrule.minute < 10){displayEndMin = "0" + endrule.minute;}
      else {displayEndMin = endrule.minute};
      theLog = theLog + "  Timer End: " + endrule.hour +":"+ displayEndMin;
      console.log(theLog);

          // Add end action here
          var j = ns.scheduleJob(endrule, function(){
            var api = '/gpio';
            // /gpio/7/Relay/toggle
            var j5 = '/' + devPin + '/' + devType +'/';
            var j5fun = 'off';
            var str = api + j5 + j5fun;
            var url = host + str;
            // check if schedule is enabled
            // add file read at run-time
            if(item.enabled == 1){
              // post command to GPIO API
              needle.post(url, {src : "Timer"+item.ID }, function(err, resp){
                if(err){console.log(err)};
                //console.log(resp);
              })
              console.log('Turning OFF ' + item.name + ' ' + item.description + ' w/End Rule: #' + item.ID + ' at '  + dateTime());
            }
          });
          jobAr.push(j);
          schJobs.push(jobAr);

  });
},
cancelTimers: (cb)=>{
  schJobs.forEach(function(ar){
    ar.forEach(function(jb){
      jb.cancel();
      console.log("Timer Cancelled");
    })
  })
  schJobs = [];
  if(cb){cb();}


}

}; // end module exports
