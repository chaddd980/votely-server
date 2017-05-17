var mongoose = require('mongoose');
var express = require('express');


var PollSchema = mongoose.Schema({
  question: {
    type: String
  },
  options: {
    type: Array
  },
  user: {
    type: String
  }
});

var Poll = module.exports = mongoose.model('Poll', PollSchema)
