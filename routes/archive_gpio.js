var express = require('express');
var router = express.Router();
var Gpio = require('onoff').Gpio;

/* GET home page. */
router.get('/', function(req, res){
  res.write("<h3>Use /on/{pin} or /off/{pin} to control GPIO.</h3>")

})

router.get('/:pin', function(req, res) {
  const gpioPin = req.params.pin;
  const outPin = new Gpio(gpioPin, 'out');
  var pinHL;
  var pinStatus = outPin.readSync();
  if(pinStatus == 1){
     pinHL = "HIGH";
  }
  else{
    pinHL = "LOW";
  }
  var dir = outPin.direction();
  console.log('Pin #' + gpioPin + " is set to " +dir + ' and is currently '+ pinHL);
  res.send('Pin #' + gpioPin + " is set to " +dir + ' and  '+ pinHL)

});

router.post('/:pin/:fun', function(req, res) {
    const gpioPin = req.params.pin;
    const func = req.params.fun;
    const outPin = new Gpio(gpioPin, 'out');
    var pinHL;
    if(func == 'on'){
      outPin.write(1, function (err){
        if(err){throw err;}
      });
      pinHL = "HIGH";
    }
    else if(func == 'off'){
      outPin.write(0, function (err){
        if(err){throw err;}
      });
      pinHL= "LOW";
    }
    else if(func == 'toggle'){
        var value = outPin.read();
        if(value == 0){
        outPin.write(1, function (err) { // Asynchronous write
            if (err) {throw err}
          });
          pinHL = "HIGH";
        }
        else{
          outPin.write(0, function (err) { // Asynchronous write
              if (err) {throw err}
            });
            pinHL = "LOW";
          }
        }
    res.send('Hello');
    res.send('Pin #' + gpioPin + " is set to " +dir + ' and  '+ pinHL);

});

module.exports = router;
