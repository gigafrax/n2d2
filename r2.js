var http  = require ('http');

var path = require ('path');

var express = require ('express');

var piblaster = require ('pi-blaster.js');

var PiServo = require('pi-servo');

var app = express();

app.use(express.static(__dirname));

var servo = new PiServo(14);

var servoHome = 90;  //off
var servoRight = 0;
var servoLeft = 180;
var servoStep = 10;
var servoCurrentPos = servoHome;

var legR_A = 17; //pin for PWM
var legR_B = 18; //pin for PWM

//var legR_A = 23; //pin for PWM
//var legL_A = 24; //pin for PWM



var legL_A = 27;
var legL_B = 22;


var speedlow = 0.4;
var speedmid = 0.7;
var speedhi = 1;

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
function moveForward(pinA, pinB){
  piblaster.setPwm(pinA, currentSpeed);
  piblaster.setPwm(pinB, 0);
}

function moveBackward(pinA, pinB){
  piblaster.setPwm(pinA, 0);
  piblaster.setPwm(pinB, currentSpeed);
}

function moveHalfForward(pinA, pinB){
  piblaster.setPwm(pinA, (currentSpeed*0.7));
  piblaster.setPwm(pinB, 0);
}

function moveHalfBackward(pinA, pinB){
  piblaster.setPwm(pinA, 0);
  piblaster.setPwm(pinB, (currentSpeed*0.7));
}

function stop(pinA, pinB){
  piblaster.setPwm(pinA, 0);
  piblaster.setPwm(pinB, 0);
}

//forward function

app.get('/forward', function(req, res){
       moveForward(legR_A, legR_B);
       moveForward(legL_A, legL_B);

});

//back function

app.get('/backward', function(req, res){
      moveBackward(legR_A, legR_B);
      moveBackward(legL_A, legL_B);
       res.end('Going back');
});


//left function

app.get('/left', function(req, res){
      moveForward(legR_A, legR_B);
      moveBackward(legL_A, legL_B);
       res.end('turning left');
});

//right function

app.get('/right', function(req, res){
      moveBackward(legR_A, legR_B);
      moveForward(legL_A, legL_B);
      res.end('turning right');
});


app.get('/rtforward', function(req, res){
        moveHalfForward(legR_A, legR_B);
        moveForward(legL_A, legL_B);
       res.end('turning slightly right');
});

app.get('/ltforward', function(req, res){
        moveForward(legR_A, legR_B);
        moveHalfForward(legL_A, legL_B);
        res.end('turning slightly left');
});


app.get('/rtbackward', function(req, res){
         moveHalfBackward(legR_A, legR_B);
         moveBackward(legL_A, legL_B);
         res.end('turning slightly right');
});

app.get('/ltbackward', function(req, res){
        moveBackward(legR_A, legR_B);
        moveHalfBackward(legL_A, legL_B);
       res.end('turning slightly left');
});










//stop function

app.get('/stop', function(req, res){
       stop(legR_A, legR_B);
       stop(legL_A, legL_B);
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

       servo.open().then(function(){
         servo.setDegree(servoCurrentPos);
       });
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
       servo.open().then(function(){
         servo.setDegree(servoCurrentPos);
       });
       res.end('panning right');
});

//camera home  function
app.get('/home', function(req, res){
         servoCurrentPos = servoHome;
         servo.open().then(function(){
           servo.setDegree(servoCurrentPos);
         });
         res.end('home');
});



//camera full right  function
app.get('/panfull_rt', function(req, res){
         servoCurrentPos = servoRight;
         servo.open().then(function(){
           servo.setDegree(servoCurrentPos);
         });

         res.end('camera right position');

});

//camera full left  function
app.get('/panfull_lt', function(req, res){
         servoCurrentPos = servoLeft;
         servo.open().then(function(){
           servo.setDegree(servoCurrentPos);
         });
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
