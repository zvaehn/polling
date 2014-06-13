/**
 * Core
 * Loading Middleware, insert routes and listen to a port.
 */

var express     = require('express')(),
    //http        = require('http'),
    path        = require('path'),
    cons        = require('consolidate'),
    mongoose    = require('mongoose'),
    clc         = require('cli-color'),

    http        = require('http').Server(express),
    io          = require('socket.io')(http),    

    config      = require('./config'),
    middleware  = require('./middleware'),
    routes      = require('./routes');

var msgInfo = clc.xterm(39);

// Save current directory in global
__coredir = __dirname;

// Save current host in global
//__host = 'theclonker.de:8080';
__host = 'localhost:4000';

// Setup app with configuration and Middleware
function setup(app) {
  // Set hogan.js as view engine out of consolidate.js
  app.engine('html', cons.hogan);
  app.set('view engine', 'html');
  app.set('views', __dirname + '/views');

  // Custom res.message() method
  // to store messages in the current session
  app.response.message = function(msg) {
    var sess = this.req.session;
    sess.messages = sess.messages || [];
    sess.messages.push(msg);
    return this;
  };

  // Connect to mongodb, yeeeah
  mongoose.connect('mongodb://localhost/polling');

  // Load middleware
  middleware(app);

  // Setting up all routes
  routes.frontend(app);
  routes.errors(app);

  // When no middleware was used we assume it's
  // a good old 404
  app.use(function(req, res, next){
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
      res.render('error/404', { url: req.url });
      return;
    }

    // respond with json
    if (req.accepts('json')) {
      res.send({ error: 'Not found' });
      return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
  });

  
  // However, when no middleware was used and
  // it has a signature of 4 parameters,
  // we've got an server error
  app.use(function(err, req, res, next){
    res.status(err.status || 500);
    console.log(err);
    res.render('error/500', { error: err });
  });

  express.get('/', function(req, res){
    res.send('ok');
  });
  
  // Listen on port
  http.listen(config().server.port, function() {
      console.log(msgInfo('//    Server is up and running!     //'));
      console.log(msgInfo('//    Port: ' +config().server.port+'                    //'));
    }
  );

  io.on('connection', function(socket){
    console.log('a user connected');
    
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });

    socket.on('poll-update', function(data) {
      socket.broadcast.emit('poll-update-'+data.question, data.answer);
      console.log(data.question + ' has been answered with: ' + data.answer);
    });
  });
}





// Init express and set it up afterwards (if not already happened)
function init(app) {
  if (!app) {
    app = express;
  }

  setup(app);
}

module.exports = init;