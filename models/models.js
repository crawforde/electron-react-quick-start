var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect(process.env.MONGODB_URI);

var userSchema = new Schema({
  username: {
    type:String,
    required: true
  },
  password: {
    type:String,
    required: true
  },
  firstName: String,
  documents: {
    type: Schema.Types.ObjectId,
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
