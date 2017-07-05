var http  = require ('http');

var path = require ('path');

var express = require ('express');

var app = express();

app.use(express.static(__dirname));


var Gpio = require('pigpio').Gpio,
  head = new Gpio(14, {mode: Gpio.OUTPUT}),
  legR1 = new Gpio(17, {mode: Gpio.OUTPUT}),
  legR2 = new Gpio(18, {mode: Gpio.OUTPUT}),
  legL1 = new Gpio(27, {mode: Gpio.OUTPUT}),
  legL2 = new Gpio(22, {mode: Gpio.OUTPUT});




var servoHome = 1200;  //off
var servoRight = 600;
var servoLeft = 2000;
var servoStep = 50;
var servoCurrentPos = servoHome;

/*var legR_A = 17; //pin for PWM
var legR_B = 18; //pin for PWM

//var legR_A = 23; //pin for PWM
//var legL_A = 24; //pin for PWM



var legL_A = 27;
var legL_B = 22;*/


var speedlow = 128;
var speedmid = 178;
var speedhi = 254;

var currentSpeed = speedmid;




//////////speed set///////

app.get('/speed_low', function(req, res){
       currentSpeed = speedlow;
       res.end('setting speed to low');
});

app.get('/speed_mid', function(req, res){
       currentSpeed = speedmid;
       res.end('setting speed to low');
});

app.get('/speed_hi', function(req, res){
       currentSpeed = speedhi;
       res.end('setting speed to low');
});

//////////end of speed set///////////

//forward function

app.get('/forward', function(req, res){
       legR1.pwmWrite(currentSpeed);
       legR2.pwmWrite(0);
       legL1.pwmWrite(currentSpeed);
       legL2.pwmWrite(0);

});

//back function

app.get('/backward', function(req, res){
      legR1.pwmWrite(0);
      legR2.pwmWrite(currentSpeed);
      legL1.pwmWrite(0);
      legL2.pwmWrite(currentSpeed);
       res.end('Going back');
});


//left function

app.get('/left', function(req, res){
      legR1.pwmWrite(currentSpeed);
      legR2.pwmWrite(0);
      legL1.pwmWrite(0);
      legL2.pwmWrite(currentSpeed);

       res.end('turning left');
});

//right function

app.get('/right', function(req, res){
  legR1.pwmWrite(0);
  legR2.pwmWrite(currentSpeed);
  legL1.pwmWrite(currentSpeed);
  legL2.pwmWrite(0);
      res.end('turning right');
});


app.get('/rtforward', function(req, res){
  legR1.pwmWrite(currentSpeed*0.5);
  legR2.pwmWrite(0);
  legL1.pwmWrite(currentSpeed);
  legL2.pwmWrite(0);
       res.end('turning slightly right');
});

app.get('/ltforward', function(req, res){
  legR1.pwmWrite(currentSpeed);
  legR2.pwmWrite(0);
  legL1.pwmWrite(currentSpeed*0.5);
  legL2.pwmWrite(0);
        res.end('turning slightly left');
});


app.get('/rtbackward', function(req, res){
  legR1.pwmWrite(0);
  legR2.pwmWrite(currentSpeed);
  legL1.pwmWrite(0);
  legL2.pwmWrite(currentSpeed*0.5);
         res.end('turning slightly right');
});

app.get('/ltbackward', function(req, res){
  legR1.pwmWrite(0);
  legR2.pwmWrite(currentSpeed*0.5);
  legL1.pwmWrite(0);
  legL2.pwmWrite(currentSpeed);
       res.end('turning slightly left');
});


app.get('/stop', function(req, res){
  legR1.digitalWrite(0);
  legR2.digitalWrite(0);
  legL1.digitalWrite(0);
  legL2.digitalWrite(0);
       res.end('stop');
});

////////////////////////////////////servo///////////////////////////
//panlt function
app.get('/panlt', function(req, res){
       if (servoCurrentPos< servoLeft) {
         servoCurrentPos += servoStep;
       }
       else {
         servoCurrentPos = servoLeft;
       }

       head.servoWrite(servoCurrentPos);
       res.end('panning left');
});

//panrt function
app.get('/panrt', function(req, res){
       if (servoCurrentPos> servoRight) {
         servoCurrentPos -= servoStep;
       }
       else {
         servoCurrentPos = servoRight;
       }
       head.servoWrite(servoCurrentPos);

       res.end('panning right');
});

//camera home  function
app.get('/home', function(req, res){
         servoCurrentPos = servoHome;
         head.servoWrite(servoCurrentPos);

         res.end('home');
});



//camera full right  function
app.get('/panfull_rt', function(req, res){
         servoCurrentPos = servoRight;
         head.servoWrite(servoCurrentPos);

         res.end('camera right position');

});

//camera full left  function
app.get('/panfull_lt', function(req, res){
         servoCurrentPos = servoLeft;
         head.servoWrite(servoCurrentPos);

         res.end('camera left position');

});


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/templates/index.html'));
});


//express route for unrecognised incoming requests
app.get('*', function(req, res){
       res.status(404).send('Unrecognised API call');
});

//express route to handle errors
app.use(function(err, req, res, next){
       if (req.xhr){
          res.status(500).send('Oops, something went wrong');
       } else {
          next(err);
       }
});




//on clrl-c, put stuff here to execute before closing your server with ctrl-c
process.on('SIGINT', function() {
 var i;
 console.log("\nGracefully shutting down from SIGINT (Ctrl+C)");
 process.exit();
});

app.listen(3000);
console.log('App running port 3000');
