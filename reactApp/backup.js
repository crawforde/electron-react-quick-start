import React from 'react';
import { Editor, EditorState, RichUtils, Modifier } from 'draft-js';
import Toolbar from './Toolbar';
import Save from './Save';
import History from './History';
import { styleMap } from './editorStyles';
import axios from 'axios';
import openSocket from 'socket.io-client';
import Modal from 'react-modal';
import { modalStyles } from '../public/styles/styles.js';
import { contentFromJSON, contentToJSON, assignDropdownValues } from './staticMethods';
import setUpClientSocket from './setUpClientSocket';

const SERVER_URL = "http://localhost:3000";
const SOCKET_SERVER_URL = "http://eaacacab.ngrok.io";
const LIVE_VERSION_WAIT_TIME = 3;                           // MAXIMUM NUMBER OF SECONDS WE ARE WILLING TO WAIT FOR A LIVE VERSION OF THE DOCUMENT FROM OTHER EDITORS



class MyEditor extends React.Component {

  constructor(props) {
    super(props);
    // SET COMPONENT VARIABLES
    var pathname = props.location.pathname;
    pathname = pathname.split('/');
    this.editorColors = ['red','blue','yellow','green','purple','lightpink'];
    this.saving = false;
    this.receivedLive = false;
    this.socket = openSocket(SOCKET_SERVER_URL);
    this.liveRequest;
    this.state = {
      loading: true,
      docId: pathname.pop(),
      username: pathname.pop(),
      editorState: EditorState.createEmpty(),
      liveState: EditorState.createEmpty(),
      history: [{state : null , timeStamp : null}],
      currentVersion: 0,
      COLOR: 'mixed',
      SIZE: 'mixed',
      readOnly: false,
      //liveEditors: ,
      notification: ''
    };

    // BIND COMPONENT METHODS
    this.bindThings(this);
  }

// COMPONENT LIFECYCLE METHODS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  componentDidMount(){

    // SET UP SOCKET EVENT LISTENERS
    setUpClientSocket.bind(this)();

    // REQUEST DOCUMENT INFORMATION
    axios.get(`${SERVER_URL}/editorView/${this.state.username}/${this.state.docId}`)
    .then((resp)=>{
      const history = resp.data.version.map((version)=>({
        state: EditorState.createWithContent(contentFromJSON(version.state)),
        timeStamp: version.timeStamp
      }));
      const editorState = EditorState.createWithContent(history[history.length - 1].state.getCurrentContent());
      this.setState({
        history,
        editorState,
        liveState: editorState,
        currentVersion: history.length - 1
      }, ()=>{

        // EMIT DOCUMENT JOIN EVENT
        this.state.socket.emit('document',{docId: this.state.docId, username: this.state.username});

        // REQUEST A LIVE VERSION OF THE DOCUMENT FROM OTHER EDITORS
        this.state.socket.emit('liveVersionRequest');

        // THIS IS THE MAXIMUM AMOUNT OF TIME THAT WE WILL WAIT FOR A LIVE VERSION
        setTimeout(()=>{
          if(!this.receivedLive) {
            this.receivedLive = true;
            this.removeLoadScreen();
          }
        }, 1000 * LIVE_VERSION_WAIT_TIME);

      });
    })
    .catch((err)=>{
      console.log('Error:', err);
    });
  }

// PRIMARY METHODS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  onChange(newState){
    // DO NOTHING IN READ ONLY MODE
    if(this.state.readOnly) return;

    var newContentState = newState.getCurrentContent();
    var newSelection = newState.getSelection();

    // IF THERE HAS BEEN A CONTENT CHANGE...
    if(newContentState !== this.state.editorState.getCurrentContent()){
      this.handleContentChange(newContentState, newState.getLastChangeType());
      this.updateLive(newState);
    }

    // IF THERE HAS BEEN A SELECTION EVENT...
    else if(newSelection !== this.state.editorState.getSelection()){
      var dropDownValues = this.handleSelectionChange(newContentState, newSelection);
      this.updateLive(newState, false, dropDownValues);
    }
  }

  handleContentChange(newContentState, lastChangeType){
    console.log('Content change');
    var rawContentJSON = contentToJSON(newContentState);
    this.state.socket.emit('docUpdate', { rawContentJSON , lastChangeType });
  }

  handleSelectionChange(newContentState, newSelectionState){
    console.log(newSelectionState.isCollapsed() ? 'cursor movement' : 'selection change');

    /* WE WANT TO HAVE DIRECT ACCESS TO THE FEATURES THAT ARE APPLIED TO EACH
    CHARACTER IN THE CURRENT SELECTION. THE FOLLOWING CODE DOES THIS.
    COMMENCE "THE JOURNEY OF A THOUSAND IMMUTABLES", STARRING draft.js */
    var anchorKey = newSelectionState.getAnchorKey();
    var contentBlock = newContentState.getBlockForKey(anchorKey);
    var start = newSelectionState.getStartOffset();
    var end = newSelectionState.getEndOffset();
    var chars = contentBlock.getCharacterList()._tail;
    if(chars){
      var charStyles = chars.array.map((metadata)=>{
        return metadata.getStyle() ? metadata.getStyle()._map._list : metadata;
      });
      charStyles = charStyles.slice(start,end);
      charStyles = charStyles.map((list)=>{
        if(list._tail){
          return list._tail.array.map((feature)=>{
            return feature ? feature[0] : feature;
          });
        }
        return false;
      });

      /* AFTER COMPLETING THIS TERRIFYING JOURNEY THROUGH THE EDITOR STATE,
      WE FINALLY HAVE SOMETHING USEFUL STORED IN charStyles. THIS IS AN ARRAY
      WITH EACH INDEX CORRESPONDING TO A CHARACTER IN THE SELECTION. THE
      CONTENT AT ANY PARTICULAR INDEX IS EITHER AN ARRAY OF FEATURES APPLIED
      TO THAT CHARACTER (FEATURES REPRESENTED BY THEIR NAMES, AS STRINGS),
      OR false, IF NO FEATURES ARE APPLIED. */

      // WE NOW USE charStyles TO PERFORM SELECTION EVENT BEHAVIOR.
      return assignDropdownValues(charStyles);
    }
  }

  onSave(){
    // DON'T SAVE IF WE'RE IN READ ONLY MODE
    if(this.state.readOnly){
      return;
    }
    const currentContentState = this.state.history[this.state.history.length - 1].state.getCurrentContent();
    const newContentState = this.state.liveState.getCurrentContent();
    // DON'T SAVE IF THERE HAS BEEN NO CONTENT CHANGE SINCE THE LAST SAVE
    if(this.saving || currentContentState === newContentState){
      return;
    }
    this.saving = true;
    this.state.socket.emit('saving');
    var timeStamp = new Date().toString();
    var saveState = EditorState.createWithContent(this.state.editorState.getCurrentContent());
    var saveStateJSON = contentToJSON(saveState.getCurrentContent());
    axios.post(`${SERVER_URL}/editorView/${this.state.docId}/save`,{
      newVersion: {
        timeStamp,
        state: saveStateJSON
      }
    })
    .then(()=>{
      var newHistory = this.state.history.slice();
      newHistory.push({
        timeStamp,
        state: saveState
      });
      this.setState({
        history: newHistory,
        currentVersion: newHistory.length - 1
      },() => {
        this.state.socket.emit('doneSaving', {
          state: saveStateJSON,
          timeStamp
        });
        this.saving = false;
      });
    })
    .catch((err)=>{
      console.log('Error:',err);
    });
  }

  changeVersion(newVersion){
    var newReadOnly = parseInt(newVersion) !== this.state.history.length - 1;
    if(newReadOnly){
      this.setState({
        editorState: EditorState.createWithContent(this.state.history[newVersion].state.getCurrentContent()),
        currentVersion: newVersion,
        readOnly: newReadOnly
      });
    }
    else {
      this.setState({
        editorState: EditorState.createWithContent(this.state.liveState.getCurrentContent()),
        currentVersion: newVersion,
        readOnly: newReadOnly
      });
    }
  }

  leaveDoc(){
    this.socket.emit('leaveDoc', {docId: this.state.docId, username: this.state.username});
    this.socket.disconnect();
    this.props.history.push(`/docPortal/${this.state.username}`);
  }


  logout(){
    this.socket.emit('leaveDoc', {docId: this.state.docId, username: this.state.username});
    this.socket.disconnect();
    axios.get(`${SERVER_URL}/logout`)
    .then(() => this.props.history.push('/login'))
    .catch((err) => {
      console.log('Logout failed', err);
    });
  }

  render() {
    return (
      <div id="editor">
        <div id="doc-id">
          <div>Shareable ID: </div><div><input readOnly={true} value={this.state.docId} onFocus={(evt)=>evt.target.select()}/></div>
        </div>
        <div>
          <button onClick={() => this.leaveDoc()}>Back to Documents portal</button>
          <button onClick={() => this.logout()}>Log Out</button>
        </div>
        <Modal
          isOpen={this.state.loading}
          style={modalStyles}
          contentLabel={(this.props.newDoc) ? "New Document" : "New Collaboration"}
          >
            <h2>Loading...</h2>
       </Modal>
       <Toolbar
         COLOR={this.state.COLOR}
         SIZE={this.state.SIZE}
         setInlineStyle={(styleName)=>this.setInlineStyle(styleName)}
         setBlockStyle={(styleName)=>this.setBlockStyle(styleName)}
         toggleStrictInlineStyle={(fontSize,propertyType)=>this.toggleStrictInlineStyle(fontSize,propertyType)}
       />
       <Editor
         customStyleMap={styleMap}
         editorState={this.state.editorState}
         handleKeyCommand={this.handleKeyCommand}
         onChange={this.onChange}
         blockStyleFn={this.blockStyleFn}
       />
       <Save onSave={()=>this.onSave()} readOnly={this.state.readOnly} />
       <History versions={this.state.history} currentVersion={this.state.currentVersion} changeVersion={(newVersion)=>this.changeVersion(newVersion)}/>
       {(this.state.readOnly) ? <button onClick={() => this.changeVersion(this.state.history.length - 1)}>Go back to current edit</button> : <p></p>}
     </div>
    );
  }

// EDITOR CONTENT CHANGE HANDLERS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  setInlineStyle(styleName){
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      styleName
    ));
  }

  toggleStrictInlineStyle(toggledStyle, propertyType){
    if(toggledStyle==='mixed'){
      this.setState({
        propertyType: toggledStyle
      });
    }
    else {
      const { editorState } = this.state;
      const selection = editorState.getSelection();

      // Let's just allow one color,size,etc. at a time. Turn off all styles with same property type.

      const nextContentState = Object.keys(styleMap)
        .filter((value)=>{
          var type = value.split('_')[0];
          return type === propertyType;
        })
        .reduce((contentState, style)=>{
          return Modifier.removeInlineStyle(contentState, selection, style);
        }, editorState.getCurrentContent());

      let nextEditorState = EditorState.push(
        editorState,
        nextContentState,
        "change-inline-style"
      );

      const currentStyle = editorState.getCurrentInlineStyle();

      // Unset style override for current style.
      if(selection.isCollapsed()) {
        nextEditorState = currentStyle.reduce((state,style) => {
          return RichUtils.toggleInlineStyle(state, style);
        }, nextEditorState);
      }

      // If the style is being toggled on, apply it.
      if(!currentStyle.has(toggledStyle)){
        nextEditorState = RichUtils.toggleInlineStyle(
          nextEditorState,
          toggledStyle
        );
      }

      // Above code sometimes has unanticipated consequences for blocks of text
      // with mixed styling. This next block ensures that the desired style is
      // applied.
      const nextStyle = nextEditorState.getCurrentInlineStyle();

      if(!nextStyle.has(toggledStyle)){
        nextEditorState = RichUtils.toggleInlineStyle(
          nextEditorState,
          toggledStyle
        );
      }
      this.setState({
        propertyType: toggledStyle
      },()=>this.onChange(nextEditorState));
    }
  }

  setBlockStyle(styleName) {
    this.onChange(RichUtils.toggleBlockType(
      this.state.editorState,
      styleName
    ));
  }

  blockStyleFn(contentBlock){
    switch (contentBlock.getType()){
    case 'TEXT_LEFT':
      return 'text-align-left';
    case 'TEXT_CENTER':
      return 'text-align-center';
    case 'TEXT_RIGHT':
      return 'text-align-right';
    default:
      return '';
    }
  }

// UTILITIES //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  logLiveState(){
    console.log(this.state.liveState.toJS());
  }

  updateLive(newEditorState, removeLoadScreen, newDropDownValues){
    if(this.state.readOnly){
      this.setState({
        liveState: newEditorState
      },()=>{
        if (removeLoadScreen){
          this.removeLoadScreen();
        }
      });
    }
    else {
      var COLOR = this.state.COLOR, SIZE = this.state.SIZE;
      if(newDropDownValues){
        COLOR = newDropDownValues.COLOR;
        SIZE = newDropDownValues.SIZE;
      }
      this.setState({
        liveState: newEditorState,
        editorState: newEditorState,
        COLOR,
        SIZE
      },()=>{
        if (removeLoadScreen){
          this.removeLoadScreen();
        }
      });
    }
  }

  removeLoadScreen(){
    this.setState({
      loading: false
    },()=>{
      this.logLiveState();
    });
  }



  bindThings(self){
    self.logLiveState = self.logLiveState.bind(self);
    self.onChange = self.onChange.bind(self);
    self.handleKeyCommand = self.handleKeyCommand.bind(self);
    self.blockStyleFn = self.blockStyleFn.bind(self);
    self.leaveDoc = self.leaveDoc.bind(self);
    self.updateLive = self.updateLive.bind(self);
    self.removeLoadScreen = self.removeLoadScreen.bind(self);
  }
}

module.exports = MyEditor;
