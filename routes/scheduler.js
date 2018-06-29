var express = require('express');
var router = express.Router();
var sch = require('../data/schedule.json');
var schedule = require('node-schedule');

app = express();
console.log('hello from the schedule');

/* GET home page. */
router.use(function setTimers(req, res, next){
  // Loop through rulesets
    sch.forEach(function(item){
      daysofweek = item.daysofweek;
      st = item.startTime;
      et = item.endTime;
      //console.log(st);
//RULES
    // START TIME
      //rules
      var startrule = new schedule.RecurrenceRule();
      startrule.hour = st.h;
      startrule.minute = st.m;
      startrule.daysofweek = daysofweek;
      console.log("[" + item.ID + "]" +item.description+":  Start Time: " + startrule.hour + ":" + startrule.minute);
      // Add Start Action here
      var j = schedule.scheduleJob(startrule, function(){
  console.log('start Rule!');
});

    //End Time
      var endrule = new schedule.RecurrenceRule();
      endrule.hour = et.h;
      endrule.minute = et.m;
      endrule.daysofweek = daysofweek;
      console.log("End Time: " + endrule.hour +":"+ endrule.minute);
      // Add end action here:


      var k = schedule.scheduleJob(endrule, function(){
        console.log('End Rule!');
      });
    });
next();
});

router.get('/', function(req, res, next) {

  res.render('scheduler', {
    title: 'poolPi Scheduler',
    heading: 'Scheduler',
    pageID: 'scheduler'
  });
});

module.exports = router;
