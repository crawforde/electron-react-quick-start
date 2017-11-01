import React from 'react';
import { styleLabels }  from './editorStyles';
const labelKeys = Object.keys(styleLabels);

class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      COLOR: props.COLOR,
      SIZE: props.SIZE
    };
  }

  componentWillReceiveProps(newProps){
    this.setState({
      COLOR: newProps.COLOR ? newProps.COLOR : this.state.COLOR,
      SIZE: newProps.SIZE ? newProps.SIZE : this.state.SIZE
    });
  }

  handleStrictInlineStyle(style,type){
    this.setState({
      type: style
    },()=>this.props.toggleStrictInlineStyle(style,type));
  }

  render() {
    return (
      <div id="toolbar">
       <button onClick={()=>this.props.setInlineStyle('BOLD')} type = "button" className = "btn btn-toolbar">
         <span className="fa fa-bold"/>
       </button>
       <button onClick={()=>this.props.setInlineStyle('ITALIC')} type = "button" className = "btn btn-toolbar">
         <span className="fa fa-italic"/>
       </button>
       <button onClick={()=>this.props.setInlineStyle('UNDERLINE')} type = "button" className = "btn btn-toolbar">
         <span className="fa fa-underline"/>
       </button>
       <button onClick={()=>this.props.setBlockStyle('TEXT_LEFT')} type = "button" className = "btn btn-toolbar">
         <span className="fa fa-align-left"/>
       </button>
       <button onClick={()=>this.props.setBlockStyle('TEXT_CENTER')} type = "button" className = "btn btn-toolbar">
         <span className="fa fa-align-center"/>
       </button>
       <button onClick={()=>this.props.setBlockStyle('TEXT_RIGHT')} type = "button" className = "btn btn-toolbar">
         <span className="fa fa-align-right"/>
       </button>
       <button onClick={()=>this.props.setBlockStyle('unordered-list-item')} type = "button" className = "btn btn-toolbar">
         <span className="fa fa-list-ul"/>
       </button>
       <button onClick={()=>this.props.setBlockStyle('ordered-list-item')} type = "button" className = "btn btn-toolbar">
         <span className="fa fa-list-ol"/>
       </button>
       <div className="select-toolbar">
         <select value={this.state.SIZE} onChange={(evt)=>this.handleStrictInlineStyle(evt.target.value,'SIZE')}>
            <option key={0} value={'mixed'}>- font size -</option>
            {labelKeys.map((key,index)=>{
              var type = key.split('_')[0];
              if(type==="SIZE"){
                return (<option key={index+1} value={key}> {styleLabels[key]} </option>);
              }
              return '';
            })}
         </select>
       </div>
       <div className="select-toolbar">
         <select value={this.state.COLOR} onChange={(evt)=>this.handleStrictInlineStyle(evt.target.value,'COLOR')}>
            <option key={0} value={'mixed'}>- font color -</option>
            {labelKeys.map((key,index)=>{
              var type = key.split('_')[0];
              if(type==="COLOR"){
                return (<option key={index+1} value={key}> {styleLabels[key]} </option>);
              }
              return '';
            })}
          </select>
        </div>
      </div>
    );
  }
}

module.exports = Toolbar;
