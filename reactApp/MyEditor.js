import React from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import Toolbar from './Toolbar';

const styleMap = {
  '12': {
    fontSize: '12px'
  },
  '18': {
    fontSize: '18px'
  },
  '36': {
    fontSize: '36px'
  }
};

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty()
    };
    this.onChange = (editorState) => this.setState({editorState});
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.blockStyleFn = this.blockStyleFn.bind(this);
  }

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

  render() {
    return (
      <div id="editor" className="container">
       <Toolbar
         setInlineStyle={(styleName)=>this.setInlineStyle(styleName)}
         setBlockStyle={(styleName)=>this.setBlockStyle(styleName)}
         setFontSize={(fontSize)=>this.setFontSize(fontSize)}
       />
       <Editor
         customStyleMap={styleMap}
         editorState={this.state.editorState}
         handleKeyCommand={this.handleKeyCommand}
         onChange={this.onChange}
         blockStyleFn={this.blockStyleFn}
       />
     </div>
    );
  }
}

module.exports = MyEditor;
