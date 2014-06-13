/**
 * Answers Model
 */

var mongoose = require('mongoose'),
    Poll = require('./poll.js').Poll;  
    Schema = mongoose.Schema;

var AnswerSchema = new Schema({
  _poll: { type: Schema.ObjectId, ref: 'Poll' },
  answer: {
    type: String
  },
  counter: {
    type: Number,
    default: 0
  },
  date: {
    type: Date, 
    default: Date.now
  }
});

AnswerSchema.statics.newAnswer = function (poll, answer, next) {
  var _this = new Answer();
  _this._poll = poll;
  _this.answer = answer;
  
  _this.save(function (err) {
    next(err, _this);
  });
};

AnswerSchema.statics.getAnswersByPoll = function (poll, next) {
  this.find({_poll: poll._id}, function (err, answers) {
    if (!answers) {
      return next(err);
    }
    else {
      return next(null, answers);
    }
  });
};

AnswerSchema.statics.vote = function (answer, next) {
  Answer.findOne({_id: answer}, function(err, answer) {
    if(!answer) {
      return next(err);
    }
    else {
      var counter = answer.counter+1;

      // Update Answer with incremented vote-counter
      Answer.update(
      { _id: answer },
      { counter: counter },
        function(err) {
          if(err) {
            return next(new Error(err));
          }
        }
      );

      return next(null);
    }
  });
};



var Answer = mongoose.model('Answer', AnswerSchema);

exports.Answer = Answer;


