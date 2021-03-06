var mongoose = require('mongoose');
var { EditorState, convertToRaw } = require('draft-js');
var Schema = mongoose.Schema;
mongoose.connect(process.env.MONGODB_URI);

const newState = JSON.stringify(convertToRaw(EditorState.createEmpty().getCurrentContent()));

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
  documents:[{
    type: Schema.Types.ObjectId,
    ref: 'Doc'
  }]
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
  collaborators: Array,
  version: {
    type: Array,
    default: [
      {
        timeStamp: new Date().toString(),
        state: newState
      }
    ]
  },
  current: Boolean,
  text: Object
});

var User = mongoose.model('User', userSchema);
var Doc = mongoose.model('Doc', documentSchema);

module.exports = { User, Doc };
