import React from 'react';

// const fonts = [8,10,12,14,16,18,20,22,24,26,28,36,48,72];

class Toolbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="toolbar" className="row">
       <button onClick={()=>this.props.setInlineStyle('BOLD')} type = "button" className = "btn btn-toolbar col-xs-1">
         <span className="fa fa-bold"/>
       </button>
       <button onClick={()=>this.props.setInlineStyle('ITALIC')} type = "button" className = "btn btn-toolbar col-xs-1">
         <span className="fa fa-italic"/>
       </button>
       <button onClick={()=>this.props.setInlineStyle('UNDERLINE')} type = "button" className = "btn btn-toolbar col-xs-1">
         <span className="fa fa-underline"/>
       </button>
       <button onClick={()=>this.props.setBlockStyle('TEXT_LEFT')} type = "button" className = "btn btn-toolbar col-xs-1">
         <span className="fa fa-align-left"/>
       </button>
       <button onClick={()=>this.props.setBlockStyle('TEXT_CENTER')} type = "button" className = "btn btn-toolbar col-xs-1">
         <span className="fa fa-align-center"/>
       </button>
       <button onClick={()=>this.props.setBlockStyle('TEXT_RIGHT')} type = "button" className = "btn btn-toolbar col-xs-1">
         <span className="fa fa-align-right"/>
       </button>
       <button onClick={()=>this.props.setBlockStyle('unordered-list-item')} type = "button" className = "btn btn-toolbar col-xs-1">
         <span className="fa fa-list-ul"/>
       </button>
       <button onClick={()=>this.props.setBlockStyle('ordered-list-item')} type = "button" className = "btn btn-toolbar col-xs-1">
         <span className="fa fa-list-ol"/>
       </button>
       <select onChange={(evt)=>this.props.toggleStrictInlineStyle(evt.target.value,'SIZE')}>
          <option value={false}>- font size -</option>
          <option value={'SIZE_12'}> Small </option>
          <option value={'SIZE_18'}> Medium </option>
          <option value={'SIZE_36'}> Large </option>
       </select>
       <select onChange={(evt)=>this.props.toggleStrictInlineStyle(evt.target.value,'COLOR')}>
          <option value={false}>- font color -</option>
          <option value={'COLOR_RED'}> Red </option>
          <option value={'COLOR_ORANGE'}> Orange </option>
          <option value={'COLOR_YELLOW'}> Yellow </option>
          <option value={'COLOR_GREEN'}> Green </option>
          <option value={'COLOR_BLUE'}> Blue </option>
          <option value={'COLOR_INDIGO'}> Indigo </option>
          <option value={'COLOR_VIOLET'}> Violet </option>
       </select>
      </div>
    );
  }
}

module.exports = Toolbar;
