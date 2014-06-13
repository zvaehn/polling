/**
 * GET /:url/results
 */

var Poll = require('../../models/poll.js');

exports.get = function(req, res, next) {
  var url = req.params.url;

  // Find poll with corresponding url
  Poll.getPollByUrl({url: url}, function(err, pollwithanswers) {

    if(!pollwithanswers) {
      return next();
    }

    var total_votes = 0;

    for (var i = 0; i < pollwithanswers.answers.length; i++) {
      total_votes += pollwithanswers.answers[i].counter;
    };

    res.render('poll/results', { 
      poll: pollwithanswers,
      total_votes: total_votes
    });
  });
};