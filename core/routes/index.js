/**
 * Set up all route connections
 */

var express = require('express'),
    csurf   = require('csurf');

// Helper function to load controller
function op(path) {
  return require('../controllers/' + path);
}

// Prepare CSRF Token to be sent to view
var csrf = function (req, res, next) {
  res.locals.token = req.csrfToken();
  next();
};

// All Error Routes
exports.errors = function (app) {
  app.get('/404', function(req, res, next){
    next();
  });

  app.get('/403', function(req, res, next){
    var err = new Error('not allowed!');
    err.status = 403;
    next(err);
  });

  app.get('/500', function(req, res, next){
    next(new Error('Server error'));
  });
}

// Frontend Routes
exports.frontend = function(app) {
  // Landing-Page
  app.get('/', op('/poll/new').get);
  app.get('/poll/new', op('/poll/new').get);
  app.post('/poll/new', op('/poll/new').post);

  // PollController
  app.get('/:url', op('/poll/view').get);
  app.post('/:url/vote', op('/poll/vote').post);
  app.get('/:url/results', op('/poll/results').get);
}



