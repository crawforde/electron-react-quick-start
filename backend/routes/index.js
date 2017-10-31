var express = require('express');
var router = express.Router();
var models = require('../../models/models');
var Doc = models.Doc;
/* GET home page. */
router.get('/docPortal', function(req, res, next) {
  // var newDoc = new Doc({
  //   editors: [req.user.id]
  // });
  // newDoc.save();
  res.send('got here!!');
});

module.exports = router;
