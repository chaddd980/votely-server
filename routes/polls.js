var Poll = require('../models/poll');
var express = require('express');
var router = express.Router();

// post new poll
router.post('/newPoll', function(req, res) {
  var question = req.body.question;
  var user = req.user.username
  let optionsText = req.body.option
  var options = optionsText.split("\n")
  var optionsArray = []
  var optionObject = {}
  for(var i=0; i<options.length; i++) {
    let option = options[i]
    optionsArray.push({ [option]: 0 })
    console.log(option)
  }
  var newPoll = new Poll ({
    question: question,
    options: optionsArray,
    user: user
  });
  newPoll.save(function(err){
    if(err) throw err
  })
  console.log("hi" + newPoll)
  // res.json(newPoll)
});

// post new option


// get all posts
router.get('/allPolls', function(req,res){
  Poll.find(function(err, polls){
    if(err) throw error
    console.log(polls)
    res.json(polls)
  })
})

// get all polls by user
router.get("/:username", function(req, res){
  var username = req.params.username;
  Poll.find({"user": username}, function(err, polls){
    if(err) throw err
    console.log(polls)
    res.json(polls)
  })
})

// delete poll
router.post("/delete", function(req, res){
  var question = req.body.question
  console.log(req.body)
  Poll.findOneAndRemove({"question":question}, function(err, poll){
    if(err) throw err
    res.json(poll)
  })
})

// update poll numbers
router.post("/:question", function(req,res){
  var question = req.params.question;
  var option = req.body.option;
  var change = false
  Poll.findOne({"question": question}, function(err, poll){
    if(err) throw err
    for(var i = 0;i<poll.options.length;i++){
      var currentOption = poll.options[i]
      if(currentOption[option] >= 0){
        poll.options[i][option] += 1
        change = true
      }
    }
    if (change === false) {
      poll.options.push({[option]: 1})
    }
    poll.markModified('options')
    poll.save(function(err2, newPoll){
      if(err2) throw err2
      console.log(newPoll)
    })
  })
})



module.exports = router;
