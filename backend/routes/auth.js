var express = require('express');
var router = express.Router();
var models = require('../../models/models.js');
var User = models.User;

module.exports = function(passport) {

  router.get('/', function(req, res){
    if(!req.user){
      res.redirect('/login');
    }else{
      res.redirect('/docPortal');
    }
  });

  router.get('/register', function(req, res){
    res.send('REgister page');
  });

  router.post('/register', function(req, res){
    if(req.body.password !== req.body.rpwd){
      console.log('Password and repeated password do not match.');
    }else{
      var newUser = new User({
        username: req.body.username,
        password: req.body.password
      });
      newUser.save(function(err, result){
        if(err){
          console.log('Creating new user failed.');
        }else{
          res.redirect('/login');
        }
      });
    }
  });

  router.get('/login', function(req, res){
    res.send('login');
  });

  router.post('/login', passport.authenticate('local',
    { successRedirect: '/docPortal',
      failureRedirect: '/login'
    }));

  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
  });


  return router;
};
