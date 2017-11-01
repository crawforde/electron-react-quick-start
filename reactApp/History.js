import React from 'react';

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      selected: props.versions.length-1
    };
  }

  handleChange(value){
    this.setState({
      selected: value
    });
  }

  render() {
    return (
      <div id="history-bar">
        <span className="footer-label">Version</span>
        <select value={this.state.selected} onChange={(evt)=>this.handleChange(evt.target.value)}>
          {this.props.versions.map((date,index)=>{
            return (<option key={index} value={index}>{date}</option>);
          })}
        </select>
      </div>
    );
  }
}

module.exports = History;
