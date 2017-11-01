var express = require('express');
var router = express.Router();
var models = require('../../models/models');
var User = models.User;
var Doc = models.Doc;

router.post('/docPortal/new', function(req, res, next) {
  let newDoc = new Doc({
    title: req.body.title,
    password: req.body.password,
    collaborators: [req.body.username]
  });
  newDoc.save((err, doc) => {
    if(err) throw new Error(err);
    User.findOne({username: req.body.username}, (err, user) => {
      let newUserDoc = user.documents.slice();
      newUserDoc.push(doc._id);
      user.documents = newUserDoc;
      user.save();
      res.send(doc);
    });
  });
});

router.post('/docPortal/collab', function(req, res, next) {
  Doc.findById(req.body.id, (err, doc) => {
    if(err) throw new Error(err);
    // console.log(doc);
    if(doc.password === req.body.password){
      let docCol = doc.collaborators.slice();
      docCol.push(req.body.username);
      doc.collaborators = docCol;
      doc.save();
      User.findOne({username: req.body.username}, (err, user) => {
        if(err) throw new Error(err);
        let newDocList = user.documents.slice();
        newDocList.push(doc._id);
        user.documents = newDocList;
        user.save();
        res.send(doc);
      });
    }
  });
});

router.get('/docPortal/:username', function(req, res, next) {
  User.findOne({username: req.params.username}).populate('documents').exec(
    (err, user) => {
      // console.log(user.documents);
      res.send(user.documents);
    }
  );
});

router.get('/editorView/:docId', function(req, res, next) {
  res.send('got it');
});

module.exports = router;
