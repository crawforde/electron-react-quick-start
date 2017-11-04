import React from 'react';

class Save extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      lastSave: false,
      readOnly: this.props.readOnly
    };
  }

  componentWillReceiveProps(newProps){
    this.setState({
      readOnly: newProps.readOnly
    });
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
         <button className="btn-save" onClick={(evt)=>this.handleSave(evt)}>{(this.state.readOnly) ? 'Restore' : 'Save'}</button>
      </div>
    );
  }
}

module.exports = Save;
