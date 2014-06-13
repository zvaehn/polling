/**
 * Defining Middleware
 */

var express         = require('express'),
    path            = require('path'),
    morgan          = require('morgan'),
    bodyParser      = require('body-parser'),
    favicon         = require('serve-favicon'),
    methodOverride  = require('method-override'),
    cookieParser    = require('cookie-parser'),
    session         = require('express-session'),
    csrf            = require('csurf'),
    flash           = require('connect-flash'),
    multiparty      = require('connect-multiparty'),

    config          = require('../config');

// Custom middleware to set flush messages
var flush = function(req, res, next) {
  var msgs = req.session.messages || [];
  res.locals({
    messages: msgs,
    hasMessages: !! msgs.length
  });

  console.log(msgs);
  
  next();
  req.session.messages = [];
}

var locals = function(req, res, next) {
  res.locals.__host = __host;
}

module.exports = function (app) {
  app.use(favicon(__coredir + '/public/img/favicon.ico')); // Favicon serving
  app.use(morgan('dev')); // Logger

  // Normal Middleware stuff
  app.use(methodOverride());
  app.use(bodyParser());
  app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
  app.use(bodyParser.urlencoded());
  app.use(multiparty());

  // Session Middleware
  app.use(cookieParser(config().site.secret));
  app.use(session({ secret: config().site.secret, name: 'sid' }));

  // Flash Messages
  app.use(flash());
  app.use(function(req, res, next){
      res.locals.msg_success = req.flash('success');
      res.locals.msg_error = req.flash('error');
      res.locals.msg_error = req.flash('info');
      next();
  });

  // Setting userdata to res.local to access in view
  //app.use(userdata);

  // Routes to static files
  app.use(express.static(path.join(__coredir, 'public')));
  app.use(express.static(path.join(__root, 'public')));
}



