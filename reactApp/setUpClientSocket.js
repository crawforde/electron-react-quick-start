import { EditorState } from 'draft-js';
import { contentFromJSON, contentToJSON } from './staticMethods';

function setUpClientSocket(){
    // SET UP SOCKET BEHAVIOR: LOOK FOR LIVE VERSIONS FROM OTHER ACTIVE EDITORS WHEN WE FIRST JOIN
  this.socket.on('liveVersionResponse',(rawContentJSON)=>{
    if(!this.receivedLive){
      this.receivedLive = true;
      const content = contentFromJSON(rawContentJSON);
      const newEditorState = EditorState.createWithContent(content);
      this.updateLive(newEditorState, true);
    }
  });

  // SET UP SOCKET BEHAVIOR: LOOK FOR REQUESTS FROM OTHER USERS FOR LIVE VERSIONS OF THE DOCUMENT
  this.socket.on('liveVersionRequest', (socketId)=>{
    const content = contentToJSON(this.state.liveState.getCurrentContent());
    this.socket.emit('liveVersionResponse',{
      content,
      socketId
    });
  });

  // SET UP SOCKET BEHAVIOR: IF SOMEBODY MAKES A LIVE UPDATE TO THE DOCUMENT, ADD THIS CHANGE TO OUR LIVE VERSION
  this.socket.on('docUpdate', ({ rawContentJSON, lastChangeType }) => {
    const content = contentFromJSON(rawContentJSON);
    const newEditorState = EditorState.push(this.state.editorState, content, lastChangeType);
    this.updateLive(newEditorState);
  });

  this.socket.on('userLeft', (username) => {
    console.log(`${username} is left the document.`);
  });

  // SET UP SOCKET BEHAVIOR: ALERT THE CLIENT IF SOMEBODY NEW OPENS THE DOCUMENT
  this.socket.on('joined', (username) => {
//     this.setState({
//  //    liveEditors: [...liveEditors, { username]
//      notification: `${username} is viewing the document.`
//    });
    console.log(`${username} is viewing the document.`);
  });

  // SET UP SOCKET BEHAVIOR: ALERT IF A 7TH PERSON TRIES (AND FAILS) TO JOIN
  this.socket.on('failedToJoin', (userRoom) => {
    console.log(`${userRoom.username} failed to join ${userRoom.docId}.`);
    this.leaveDoc(userRoom.username);
  });

  // SET UP SOCKET BEHAVIOR: TEMPORARILY DISABLE SAVING WHILE ANOTHER EDITOR IS DOING SO
  this.socket.on('saving', ()=>{
    this.saving = true;
  });

  // SET UP SOCKET BEHAVIOR: RE-ENABLE SAVING AND UPDATE DOCUMENT VERSION HISTORY WHEN ANOTHER EDITOR COMPLETES A SUCCESSFUL SAVE
  this.socket.on('doneSaving', (version)=>{
    version.state = EditorState.createWithContent(contentFromJSON(version.state));
    var newHistory = this.state.history.slice();
    newHistory.push(version);
    this.setState({
      history: newHistory,
      currentVersion: this.state.readOnly ? this.state.currentVersion : newHistory.length - 1
    },()=>this.saving = false);
  });
}

module.exports = setUpClientSocket;
