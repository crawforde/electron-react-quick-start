import React from 'react';

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      currentVersion: props.currentVersion,
      history: props.versions.map((version,index)=>(version.timeStamp))
    };
  }

  componentWillReceiveProps(newProps){
    // console.log(newProps);
    this.setState({
      currentVersion: newProps.currentVersion,
      history: newProps.versions.map((version,index)=>(version.timeStamp))
    });
  }

  render() {
    return (
      <div id="history-bar">
        <span className="footer-label">Version</span>
        <select value={this.state.currentVersion} onChange={(evt)=>this.props.changeVersion(evt.target.value)}>
          {this.state.history.map((dateString,index)=><option key={index} value={index}>{dateString}</option>)}
        </select>
      </div>
    );
  }
}

module.exports = History;
