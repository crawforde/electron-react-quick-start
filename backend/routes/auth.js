var express = require('express');
var router = express.Router();
var models = require('../../models/models.js');
var User = models.User;

module.exports = function(passport) {
  router.get('/', (req, res) => {
    res.send('Backend handled');
  });
  router.post('/register', function(req, res){
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
      firstName: req.body.firstName
    });
    newUser.save(function(err, result){
      if(err){
        console.log('Creating new user failed.', err);
      } else {
        res.status(200).send("Success");
      }
    });

  });
  // traditional route handler, passed req/res
  router.post('/login', passport.authenticate('local'), function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.status(200).json({success: true});
  });

  router.get('/logout', function(req, res){
    req.logout();
  });


  return router;
};
