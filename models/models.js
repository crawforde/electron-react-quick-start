var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;
var Schema = mongoose.Schema;

mongoose.connect(connect);

var userSchema = new Schema({
  username: {
    type:String,
    required: true
  },
  password: {
    type:String,
    required: true
  },
  documents: {
    type: Schema.types.ObjectId,
    ref: 'Doc'
  }
});
var documentSchema = new Schema({
  editors:{
    type: Array
  },
  version:{
    type: Array
  },
  current: Boolean,
  text: String
});

var User = mongoose.model('User', userSchema);
var Doc = mongoose.model('Doc', documentSchema);
module.exports = { User, Doc };
