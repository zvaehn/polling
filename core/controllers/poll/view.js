/**
 * GET /:url
 */

var Poll = require('../../models/poll.js');

exports.get = function(req, res, next) {
  var url = req.params.url;

  // Find poll with corresponding url
  Poll.getPollByUrl({url: url}, function(err, pollwithanswers) {

    if(!pollwithanswers) {
      return next();
    }

    res.render('poll/show', { 
      poll: pollwithanswers
    });
  });
};