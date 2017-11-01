import React from 'react';

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      currentVersion: props.currentVersion
    };
  }

  componentWillReceiveProps(newProps){
    this.setState({
      currentVersion: newProps.currentVersion
    });
  }

  render() {
    return (
      <div id="history-bar">
        <span className="footer-label">Version</span>
        <select value={this.state.currentVersion} onChange={(evt)=>this.props.changeVersion(evt.target.value)}>
          {this.props.versions.map((version,index)=>{
            return (<option key={index} value={index}>{version.timeStamp}</option>);
          })}
        </select>
      </div>
    );
  }
}

module.exports = History;
