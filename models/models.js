var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect(process.env.MONGODB_URI);

var userSchema = new Schema({
  username: {
    type:String,
    required: true,
    unique: true
  },
  password: {
    type:String,
    required: true
  },
  firstName: String,
  documentIds: Array

});
var documentSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  ownerName: {
    type: String,
    required: true
  },
  collaboratorIds: Array,
  version: Array,
  current: Boolean,
  text: String
});

var User = mongoose.model('User', userSchema);
var Doc = mongoose.model('Doc', documentSchema);
module.exports = { User, Doc };
