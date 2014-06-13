/**
 * GET and POST /poll/new
 */

var Poll = require('../../models/poll.js');

// GET
exports.get = function(req, res, next) {  
  res.render('poll/new', { title: 'Create a new poll!' });
};

// POST
exports.post = function(req, res, next) {
  var b = req.body;
  var allow_multiuser = false;
  var options = {};

  if(b.multiuser == "on") {
    allow_multiuser = true;
  }

  options.allow_multiuser = allow_multiuser;

  
  // Create new Poll with method out of Poll-Object
  Poll.newPoll(b.question, b.answers, options, function (err, poll) {
    if(!poll) {
      res.render('poll/new', { title: 'Create new poll', message: err });
    }
    else {
      req.session.messages = ['Successfully created your Poll ' + poll.question + '.'];
      res.redirect('/'+poll.url);
    }
  });
};