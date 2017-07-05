var Gpio = require('onoff').Gpio,
  leanForward = new Gpio(5, 'out'),
  leanBackward = new Gpio(6, 'out'),
  midSwitch = new Gpio(19, 'in', 'both'),
  frontSwitch = new Gpio(13, 'in', 'both'),
  backSwitch = new Gpio(26, 'in', 'both');



app.get('/leanforward', function(req, res){
  leanForward.writeSync(1);
  frontSwitch.watch(function (err, value) {
    if (err) {
      throw err;
    }

    leanForward.writeSync(1-value);
  });

  app.get('/leanbackward', function(req, res){
    leanBackward.writeSync(1);
    backSwitch.watch(function (err, value) {
      if (err) {
        throw err;
      }

      leanBackwards.writeSync(1-value);
    });



process.on('SIGINT', function () {
  backward.unexport();
  forward.unexport();
  backpos.unexport();
  midpos.unexport();
  frontpos.unexport();
});
