var express = require('express');
var router = express.Router();
var models = require('../../models/models');
var Doc = models.Doc;
var User = models.User;
/* GET home page. */
router.get('/docPortal/new', function(req, res, next) {

  res.send('got here!!');
});
router.get('/docPortal/:username', function(req, res, next) {
  User.findOne({username: req.params.username},(err, user) => {
    if(err) console.log("Error finding User", err);
    user.documentIds.map((id) => {
      Doc.findOne({})
    })
  })
  res.send('got here!!');
});

module.exports = router;
