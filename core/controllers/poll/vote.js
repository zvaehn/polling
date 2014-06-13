/**
 * POST /:url/vote
 */

var Poll = require('../../models/poll.js');

exports.post = function(req, res, next) {
  var url = req.params.url;
  var answer = req.body.answer;
  var ip = req.connection.remoteAddress;

  // Find poll with corresponding url
  Poll.voteForUrl(url, answer, ip, function(err, url) {
    if(err == "no") {
      req.session.messages = ["Sorry, but you can't vote twice."];
    }
    else {
      req.session.messages = ["Thanks for your vote"];
    }
    
    res.redirect('/'+url+'/results');  
    
  });
};