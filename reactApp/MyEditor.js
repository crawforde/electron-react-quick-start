import React from 'react';
import {Editor, EditorState, RichUtils, Modifier} from 'draft-js';
import Toolbar from './Toolbar';

const styleMap = {
  'SIZE_12': {
    fontSize: '12px'
  },
  'SIZE_18': {
    fontSize: '18px'
  },
  'SIZE_36': {
    fontSize: '36px'
  },
  'COLOR_RED': {
    color: 'rgba(255, 0, 0, 1.0)',
  },
  'COLOR_ORANGE': {
    color: 'rgba(255, 127, 0, 1.0)',
  },
  'COLOR_YELLOW': {
    color: 'rgba(180, 180, 0, 1.0)',
  },
  'COLOR_GREEN': {
    color: 'rgba(0, 180, 0, 1.0)',
  },
  'COLOR_BLUE': {
    color: 'rgba(0, 0, 255, 1.0)',
  },
  'COLOR_INDIGO': {
    color: 'rgba(75, 0, 130, 1.0)',
  },
  'COLOR_VIOLET': {
    color: 'rgba(127, 0, 255, 1.0)',
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

  toggleStrictInlineStyle(toggledStyle, propertyType){
    if(toggledStyle==='false'){
      return;
    }
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

    this.onChange(nextEditorState);
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
         toggleStrictInlineStyle={(fontSize,propertyType)=>this.toggleStrictInlineStyle(fontSize,propertyType)}
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
