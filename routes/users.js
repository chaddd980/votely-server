var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var jwt = require('jsonwebtoken');
var config = require('../config.js')


// post register
router.post('/register', function(req,res) {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var newUser = new User ({
    username: username,
    email: email,
    password: password
  });
    User.createUser(newUser, function(err, createdUser){
      if(err) throw err;
      console.log("hi" + createdUser)
      res.json(createdUser)
    });
});

// get register
router.get('/register/:username', function(req, res) {
  var username = req.params.username;
  User.findOne({ 'username': username }, function(err, user) {
    if (err) throw err
    console.log('user already created')
    res.json(user)
  })
})

passport.use(new LocalStrategy(
  function(username, password, done) {
      User.getUserByUsername(username, function(err, user){
        if(err) throw err;
        if (!user){
          return done(null, false, {message: 'Unknown User'});
        }
        User.comparePassword(password, user.password, function(err, isMatch) {
          if(err) throw err;
          if(isMatch) {
            return done(null, user);
          } else {
            return done(null, false, {message:'invalid password'});
          }
        })
      })
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    console.log(req.user);
    var user = req.user;
    const token = jwt.sign({
      id: req.user._id,
      username: req.user.username
    }, config.jwtsecret)
    res.json({ user, token });
});

// router.get('/login'), function(req, res){
//   console.log('hi')
//   res.redirect("http://localhost:3000")
// }
//
// router.get('/fail'), function(req, res){
//   console.log('hi')
//   res.redirect("http://localhost:3000/login")
// }

// router.get('/logout', function(req, res){
//   req.logout();
//   req.flash('success_msg', "You're logged out");
//   res.redirect('/users/login')
// })

module.exports = router;
