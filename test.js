var piblaster = require ('pi-blaster.js');

var PiServo = require('pi-servo');

var servo = new PiServo(14);

servo.open().then(function(){
  servo.setDegree(90);
});

piblaster.setPwm(17, 0);
piblaster.setPwm(18, 0);
piblaster.setPwm(27, 0);
piblaster.setPwm(22, 0);


piblaster.setPwm(17, 0);
piblaster.setPwm(18, 1);
piblaster.setPwm(27, 0);
piblaster.setPwm(22, 1);
