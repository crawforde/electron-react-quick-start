import React from 'react';

class Save extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      lastSave: false
    };
  }

  handleSave(evt){
    evt.preventDefault();
    this.setState({
      lastSave: new Date()
    }, ()=>this.props.onSave(evt));
  }

  render() {
    return (
      <div id="save-bar">
         <button className="btn-save" onClick={(evt)=>this.handleSave(evt)}>{(this.props.readOnly) ? 'Restore' : 'Save'}</button>
         <p>Last save: {this.state.lastSave ? this.state.lastSave.toString() : 'never'}</p>
      </div>
    );
  }
}

module.exports = Save;
