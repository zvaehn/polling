/**
 * Poll Model
 */

var mongoose  = require('mongoose'),

    express   = require('express')(),
    http      = require('http').Server(express),
    io        = require('socket.io')(http), 

    Schema    = mongoose.Schema;

var Answer = require('./answer.js').Answer;    

// required Validation
// checks if value is true and has a length
function required(val) {
  return val && val.length;
}

// Create random string
function randString(len) {
  var result = '';
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for(var i = 0; i < len; i++)
      result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

var PollSchema = new Schema({
  question: {
    type: String,
    validate: [ required, 'A question is required.' ]
  },
  url: {
    type: String,
    index: { unique: true },
  },
  answers: {
    type: Array
  },
  ips: {
    type: Array
  },
  option: {
    type: Array
  },
  date: { type: Date, default: Date.now }
});



// Return a Poll identified by an URL
PollSchema.static('getPollByUrl', function(url, next) {
  this.findOne(url, function (err, poll) {
    if (!poll) {
      return next(err);
    }
    else {
      Answer.getAnswersByPoll(poll, function (err, answers) {        
        var pollwithanswers = poll;
        pollwithanswers['answers'] = answers;
        return next(null, pollwithanswers);
      });
      //return next(null, poll);
    }
  });
});


// Vote
PollSchema.static('voteForUrl', function(url, answer, ip, next) {

  // Existiert die Umfrage?
  this.findOne({url: url}, function (err, poll) {
    if(!poll) {
      return next(err);
    }
    else {
      // Check if IP is unique
      var allow_multiuser = false;

      for (var i = 0; i < poll.ips.length; i++) {
        if(poll.ips[i] == ip && !allow_multiuser) {
          return next('no', url);
        }
      };

      poll.ips.push(ip);      

      PollModel.update(
      { _id: poll._id },
      { ips: poll.ips },
        function(err) {
          if(err) {
            return next(new Error(err));
          }
        }
      );

      // Stimme abgeben
      Answer.vote(answer, function(err) {
        if(err) {
          return next(err);
        }
        else {
          return next(null, url);
        }
      });
    }
  });
});


// Creates a new Poll
PollSchema.static('newPoll', function (question, answers, options, next) {
  var _this = new PollModel();
  _this.question = question;
  _this.url = randString(4);
  _this.option = Array();

  if(options.allow_multiuser == true) {
    _this.option['allow_multiuser'] = true;
  }
  else {
    _this.option['allow_multiuser'] = false;
  }

  _this.save(function (err, poll) {
    for (var i = 0; i < answers.length; i++) {
      Answer.newAnswer(poll, answers[i], function(err, answer) {
        if(err) {
          console.log('something went wrong: ' + err);
          res.send('Error saving answers.' + err);
          return next(err);
        }
      });
    };

    next(null, poll);
  });
  
});

mongoose.model('polls', PollSchema);
var PollModel = mongoose.model('polls');

module.exports = PollModel;



